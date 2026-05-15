const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const upload = require('../middleware/upload');

// PDF Operations
router.post('/merge', upload.array('files'), pdfController.mergePDFs);
router.post('/split', upload.array('files'), pdfController.splitPDF);
router.post('/compress', upload.array('files'), pdfController.compressPDF);
router.post('/convert/pdf-to-word', upload.array('files'), pdfController.convertToWord);
router.post('/convert/pdf-to-jpg', upload.array('files'), pdfController.pdfToJpg);
router.post('/convert/jpg-to-pdf', upload.array('files'), pdfController.jpgToPdf);
router.post('/unlock', upload.array('files'), pdfController.unlockPDF);
router.post('/edit', upload.array('files'), pdfController.editPDF);
router.post('/cleanup', pdfController.cleanupFiles);

module.exports = router;
