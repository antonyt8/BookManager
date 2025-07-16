const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');

router.get('/cadastro', UserController.cadastroForm);
router.post('/cadastro', UserController.cadastrar);
router.get('/login', UserController.loginForm);
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);
router.get('/recuperar', UserController.solicitarRecuperacao);
router.post('/recuperar', UserController.enviarRecuperacao);
router.get('/redefinir/:token', UserController.mostrarRedefinirSenha);
router.post('/redefinir/:token', UserController.redefinirSenha);
router.get('/perfil', auth, UserController.perfil);
router.post('/perfil', auth, UserController.atualizarPerfil);

module.exports = router; 