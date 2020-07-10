const express = require('express');

const router = express.Router();

const UserCtrl = require('../controllers/users');
const AuthHelper = require('../Helper/AuthHelper');

router.get('/users', AuthHelper.VerifyToken, UserCtrl.GetAllUsers);
router.get('/user/:id', AuthHelper.VerifyToken, UserCtrl.GetAllUser);
router.get('/user/:username', AuthHelper.VerifyToken, UserCtrl.GetUserByName);

module.exports = router;
