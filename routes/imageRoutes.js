const express = require('express');

const router = express.Router();

const ImageCtrl = require('../controllers/image');
const AuthHelper = require('../Helper/AuthHelper');

router.post('/upload-image', AuthHelper.VerifyToken, ImageCtrl.UploadImage);

router.get('/set-default-image/:imgId/:imgVersion', AuthHelper.VerifyToken, ImageCtrl.SetDefaultImage)

module.exports = router;
