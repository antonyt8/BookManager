const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/cadastro', UserController.cadastroForm);
router.post('/cadastro', UserController.cadastrar);
router.get('/login', UserController.loginForm);
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);

module.exports = router; 