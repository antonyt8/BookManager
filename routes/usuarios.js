const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Limite: 5 tentativas por 15 minutos para login, cadastro e recuperação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: 'Muitas tentativas. Tente novamente em alguns minutos.',
  standardHeaders: true,
  legacyHeaders: false
});

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
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Apenas imagens JPG e PNG são permitidas.'));
  }
});
const passport = require('../config/passport');

router.get('/cadastro', UserController.cadastroForm);
router.post('/cadastro', authLimiter, UserController.cadastrar);
router.get('/login', UserController.loginForm);
router.post('/login', authLimiter, UserController.login);
router.get('/logout', UserController.logout);
router.get('/recuperar', UserController.solicitarRecuperacao);
router.post('/recuperar', authLimiter, UserController.enviarRecuperacao);
router.get('/redefinir/:token', UserController.mostrarRedefinirSenha);
router.post('/redefinir/:token', UserController.redefinirSenha);
router.get('/perfil', auth, UserController.perfil);
router.post('/perfil', auth, upload.single('avatar'), UserController.atualizarPerfil);
router.get('/confirmar/:token', UserController.confirmarEmail);

// Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/usuarios/login', failureFlash: true }),
  (req, res) => {
    req.session.user = {
      id: req.user.id,
      nome: req.user.nome,
      email: req.user.email,
      avatar_url: req.user.avatar_url
    };
    req.flash('success', 'Login com Google realizado com sucesso!');
    res.redirect('/livros');
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/usuarios/login');
  });
});

module.exports = router; 