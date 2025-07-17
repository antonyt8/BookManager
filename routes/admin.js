const express = require('express');
const router = express.Router();
const admin = require('../middleware/admin');
const AdminController = require('../controllers/AdminController');

router.use(admin);

router.get('/', AdminController.dashboard);
router.get('/usuarios', AdminController.listarUsuarios);
router.post('/usuarios/promover/:id', AdminController.promoverAdmin);
router.post('/usuarios/demover/:id', AdminController.demoverAdmin);
router.post('/usuarios/excluir/:id', AdminController.excluirUsuario);
router.get('/livros', AdminController.listarLivros);

module.exports = router; 