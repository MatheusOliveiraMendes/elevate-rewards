const express = require('express');
const multer = require('multer');
const path = require('path');
const uploadController = require('../controllers/uploadController');
const auth = require('../middlewares/authMiddleware');
const onlyAdmin = require('../middlewares/roleMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, './uploads'), // ajustado para src/uploads
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

console.log('📁 Salvando arquivos em:', path.resolve(__dirname, './uploads'));

router.post('/', auth, onlyAdmin('admin'), upload.single('file'), uploadController.uploadSheet);

module.exports = router;