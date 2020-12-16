const express = require('express');
const authController = require('../controllers/auth');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/token', authController.refreshToken);
router.get('/auth/me', auth, authController.getLoggedUser);
router.get('/auth/logout', auth, authController.logout);

module.exports = router;