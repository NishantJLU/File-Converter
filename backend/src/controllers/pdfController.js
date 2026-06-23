const pdfService = require('../services/pdfService');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const mergePDFs = async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'Please upload at least two PDF files to merge' });
    }

    const filePaths = req.files.map(file => file.path);
    const outputPath = await pdfService.mergePDFs(filePaths);

    // Send the merged file
    res.download(outputPath, 'merged.pdf', (err) => {
      // Cleanup input files after sending
      filePaths.forEach(filePath => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      
      if (err) {
        console.error('Error sending file:', err);
      }
    });
  } catch (error) {
    console.error('Merge error:', error);
    res.status(500).json({ error: 'Failed to merge PDF files' });
  }
};

const convertToWord = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload a PDF file to convert' });
    }

    const filePath = req.files[0].path;
    const outputPath = await pdfService.pdfToWord(filePath);

    res.download(outputPath, 'converted.docx', (err) => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

      if (err) {
        console.error('Error sending file:', err);
      }
    });
  } catch (error) {
    console.error('Conversion error:', error.stack || error);
    res.status(500).json({ error: 'Failed to convert PDF to Word', details: error.message });
  }
};

const splitPDF = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload a PDF file to split' });
    }

    const filePath = req.files[0].path;
    const outputPaths = await pdfService.splitPDF(filePath);

    const zipPath = path.join(__dirname, '../../../temp', `split-${Date.now()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      res.download(zipPath, 'split_pages.zip', (err) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        outputPaths.forEach(p => { if (fs.existsSync(p)) fs.unlinkSync(p); });
        if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
      });
    });

    archive.pipe(output);
    outputPaths.forEach((p, index) => {
      archive.file(p, { name: `page-${index + 1}.pdf` });
    });
    archive.finalize();

  } catch (error) {
    console.error('Split error:', error);
    res.status(500).json({ error: 'Failed to split PDF' });
  }
};

const compressPDF = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload a PDF file to compress' });
    }

    const filePath = req.files[0].path;
    const outputPath = await pdfService.compressPDF(filePath);

    res.download(outputPath, 'compressed.pdf', (err) => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error('Compress error:', error);
    res.status(500).json({ error: 'Failed to compress PDF' });
  }
};

const jpgToPdf = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload images to convert' });
    }

    const filePaths = req.files.map(file => file.path);
    const outputPath = await pdfService.jpgToPdf(filePaths);

    res.download(outputPath, 'images.pdf', (err) => {
      filePaths.forEach(p => { if (fs.existsSync(p)) fs.unlinkSync(p); });
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error('JPG to PDF error:', error);
    res.status(500).json({ error: 'Failed to convert images to PDF' });
  }
};

const pdfToJpg = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload a PDF file to convert' });
    }

    const filePath = req.files[0].path;
    const outputPaths = await pdfService.pdfToJpg(filePath);

    const zipPath = path.join(__dirname, '../../../temp', `images-${Date.now()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      res.download(zipPath, 'images.zip', (err) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        outputPaths.forEach(p => { if (fs.existsSync(p)) fs.unlinkSync(p); });
        if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
      });
    });

    archive.pipe(output);
    outputPaths.forEach((p, index) => {
      archive.file(p, { name: `page-${index + 1}.jpg` });
    });
    archive.finalize();

  } catch (error) {
    console.error('PDF to JPG error:', error);
    res.status(500).json({ error: 'Failed to convert PDF to JPG' });
  }
};

const unlockPDF = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload a PDF file to unlock' });
    }

    const filePath = req.files[0].path;
    const outputPath = await pdfService.unlockPDF(filePath);

    res.download(outputPath, 'unlocked.pdf', (err) => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error('Unlock error:', error);
    res.status(500).json({ error: 'Failed to unlock PDF. It might have a strong password.' });
  }
};

const editPDF = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload a PDF file to edit' });
    }

    const filePath = req.files[0].path;
    const textToAdd = req.body.text || 'Edited with File Converter';
    const outputPath = await pdfService.editPDF(filePath, textToAdd);

    res.download(outputPath, 'edited.pdf', (err) => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error('Edit error:', error);
    res.status(500).json({ error: 'Failed to edit PDF.' });
  }
};

const cleanupFiles = async (req, res) => {
  try {
    const { files } = req.body;
    if (files && Array.isArray(files)) {
      files.forEach(file => {
        const filePath = path.join(__dirname, '../../../temp', path.basename(file));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
    res.json({ message: 'Files cleaned up successfully' });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: 'Failed to cleanup files' });
  }
};

module.exports = {
  mergePDFs,
  convertToWord,
  splitPDF,
  compressPDF,
  jpgToPdf,
  pdfToJpg,
  unlockPDF,
  editPDF,
  cleanupFiles
};
