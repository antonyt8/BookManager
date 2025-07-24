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

// Callback do Google OAuth
router.get('/auth/google/callback', 
    (req, res, next) => {
        console.log('[DEBUG] Callback recebido, URL:', req.url);
        console.log('[DEBUG] Query params:', req.query);
        next();
    },
    (req, res, next) => {
        passport.authenticate('google', { failureRedirect: '/usuarios/login' })(req, res, (err) => {
            if (err) {
                console.error('[ERROR] Erro na autenticação:', err);
                return res.redirect('/usuarios/login');
            }
            console.log('[DEBUG] Autenticação bem-sucedida, usuário:', req.user);
            next();
        });
    },
    async (req, res) => {
        console.log('[DEBUG] Callback bem-sucedido, usuário:', req.user);
        try {
            // Redirecionar para dashboard
            res.redirect('/');
        } catch (error) {
            console.error('[ERROR] Erro no callback:', error);
            res.redirect('/usuarios/login');
        }
    }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/usuarios/login');
  });
});

module.exports = router; 