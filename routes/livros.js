const express = require('express');
const router = express.Router();
const LivroController = require('../controllers/LivroController');
const { livroValidation } = require('../middleware/validation');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuração do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Apenas imagens JPG e PNG são permitidas.'));
  }
});

// Proteger todas as rotas
router.use(auth);

// Rotas para listagem e criação
router.get('/', LivroController.listar);
router.get('/novo', LivroController.mostrarFormulario);
router.post('/novo', upload.single('capa'), livroValidation, LivroController.criar);

// Rotas para edição
router.get('/editar/:id', LivroController.mostrarFormularioEdicao);
router.post('/editar/:id', upload.single('capa'), livroValidation, LivroController.atualizar);

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