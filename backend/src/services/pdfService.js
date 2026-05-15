const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const { pdf } = require('pdf-to-img');
const qpdf = require('node-qpdf');

const mergePDFs = async (filePaths) => {
  const mergedPdf = await PDFDocument.create();

  for (const filePath of filePaths) {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  
  const outputPath = path.join(__dirname, '../../../temp', `merged-${Date.now()}.pdf`);
  await fs.writeFile(outputPath, mergedPdfBytes);
  
  return outputPath;
};

const pdfToWord = async (filePath) => {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: data.text.split('\n').map(line => {
        return new Paragraph({
          children: [new TextRun(line)],
        });
      }),
    }],
  });

  const wordBuffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, '../../../temp', `converted-${Date.now()}.docx`);
  await fs.writeFile(outputPath, wordBuffer);
  
  return outputPath;
};

const splitPDF = async (filePath) => {
  const pdfBytes = await fs.readFile(filePath);
  const pdf = await PDFDocument.load(pdfBytes);
  const pageCount = pdf.getPageCount();
  const outputPaths = [];

  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdf, [i]);
    newPdf.addPage(copiedPage);
    const newPdfBytes = await newPdf.save();
    const outputPath = path.join(__dirname, '../../../temp', `split-${Date.now()}-${i + 1}.pdf`);
    await fs.writeFile(outputPath, newPdfBytes);
    outputPaths.push(outputPath);
  }

  return outputPaths;
};

const compressPDF = async (filePath) => {
  const pdfBytes = await fs.readFile(filePath);
  const pdf = await PDFDocument.load(pdfBytes);
  const compressedPdf = await PDFDocument.create();
  const copiedPages = await compressedPdf.copyPages(pdf, pdf.getPageIndices());
  copiedPages.forEach(page => compressedPdf.addPage(page));
  
  const compressedBytes = await compressedPdf.save({ useObjectStreams: true });
  const outputPath = path.join(__dirname, '../../../temp', `compressed-${Date.now()}.pdf`);
  await fs.writeFile(outputPath, compressedBytes);
  return outputPath;
};

const jpgToPdf = async (filePaths) => {
  const pdfDoc = await PDFDocument.create();

  for (const filePath of filePaths) {
    const imgBytes = await fs.readFile(filePath);
    let img;
    const extension = path.extname(filePath).toLowerCase();

    try {
      if (extension === '.jpg' || extension === '.jpeg') {
        try {
          img = await pdfDoc.embedJpg(imgBytes);
        } catch (e) {
          img = await pdfDoc.embedPng(imgBytes);
        }
      } else if (extension === '.png') {
        try {
          img = await pdfDoc.embedPng(imgBytes);
        } catch (e) {
          img = await pdfDoc.embedJpg(imgBytes);
        }
      } else {
        continue;
      }

      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: img.width,
        height: img.height,
      });
    } catch (err) {
      console.error(`Failed to embed image ${filePath}:`, err.message);
      continue;
    }
  }

  if (pdfDoc.getPageCount() === 0) {
    throw new Error('No valid images were processed');
  }

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, '../../../temp', `images-to-pdf-${Date.now()}.pdf`);
  await fs.writeFile(outputPath, pdfBytes);
  return outputPath;
};

const pdfToJpg = async (filePath) => {
  let counter = 1;
  const outputPaths = [];
  
  for await (const img of await pdf(filePath)) {
    const outputPath = path.join(__dirname, '../../../temp', `page-${Date.now()}-${counter}.jpg`);
    await fs.writeFile(outputPath, img);
    outputPaths.push(outputPath);
    counter++;
  }

  return outputPaths;
};

const unlockPDF = async (filePath) => {
  const outputPath = path.join(__dirname, '../../../temp', `unlocked-${Date.now()}.pdf`);
  
  return new Promise(async (resolve, reject) => {
    qpdf.decrypt(filePath, outputPath, async (err) => {
      if (err) {
        console.warn('QPDF decrypt failed, attempting pdf-lib fallback:', err);
        try {
          const bytes = await fs.readFile(filePath);
          const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
          const savedBytes = await pdfDoc.save();
          await fs.writeFile(outputPath, savedBytes);
          resolve(outputPath);
        } catch (fallbackErr) {
          reject(fallbackErr);
        }
      } else {
        resolve(outputPath);
      }
    });
  });
};

const editPDF = async (filePath, textToAdd) => {
  const pdfBytes = await fs.readFile(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  
  firstPage.drawText(textToAdd || 'Edited with File Converter', {
    x: 50,
    y: height - 100,
    size: 30,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
  });

  const pdfBytesSaved = await pdfDoc.save();
  const outputPath = path.join(__dirname, '../../../temp', `edited-${Date.now()}.pdf`);
  await fs.writeFile(outputPath, pdfBytesSaved);
  return outputPath;
};

module.exports = {
  mergePDFs,
  pdfToWord,
  splitPDF,
  compressPDF,
  jpgToPdf,
  pdfToJpg,
  unlockPDF,
  editPDF
};
