const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tourist-app',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  res.send(req.file.path);
});

router.post('/multiple', upload.array('images', 5), (req, res) => {
  const filePaths = req.files.map((file) => file.path);
  res.send(filePaths);
});

module.exports = router;
