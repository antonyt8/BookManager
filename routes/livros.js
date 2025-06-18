const express = require('express');
const router = express.Router();
const LivroController = require('../controllers/LivroController');
const { livroValidation } = require('../middleware/validation');

// Rotas para listagem e criação
router.get('/', LivroController.listar);
router.get('/novo', LivroController.mostrarFormulario);
router.post('/novo', livroValidation, LivroController.criar);

// Rotas para edição
router.get('/editar/:id', LivroController.mostrarFormularioEdicao);
router.post('/editar/:id', livroValidation, LivroController.atualizar);

// Rota de teste sem validação
router.post('/teste-editar/:id', LivroController.atualizar);

// Rota de teste
router.get('/teste', (req, res) => {
  res.render('form-test');
});

// Rota para exclusão
router.post('/deletar/:id', LivroController.excluir);

// Rota da API (opcional)
router.get('/api/:id', LivroController.buscarPorId);

module.exports = router; 