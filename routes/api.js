const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const User = require('../models/User')(sequelize, require('sequelize').DataTypes);
const Livro = require('../models/Livro')(sequelize, require('sequelize').DataTypes);
const SECRET = process.env.JWT_SECRET || 'jwtsecret';
const rateLimit = require('express-rate-limit');

// Limite: 5 tentativas por 15 minutos para login e registro
const apiAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware para autenticar via JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Cadastro de novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário cadastrado
 *       400:
 *         description: E-mail já cadastrado
 */
// Cadastro
router.post('/register', apiAuthLimiter, async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const existente = await User.findOne({ where: { email } });
    if (existente) return res.status(400).json({ error: 'E-mail já cadastrado' });
    const user = await User.create({ nome, email, senha });
    res.status(201).json({ id: user.id, nome: user.nome, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT retornado
 *       401:
 *         description: E-mail ou senha inválidos
 */
// Login
router.post('/login', apiAuthLimiter, async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validarSenha(senha))) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos' });
    }
    const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

/**
 * @swagger
 * /api/livros:
 *   get:
 *     summary: Listar livros do usuário autenticado
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de livros
 *   post:
 *     summary: Criar novo livro
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Livro criado
 */
// CRUD de livros (protegido)
router.get('/livros', authenticateToken, async (req, res) => {
  const livros = await Livro.findAll({ where: { userId: req.user.id } });
  res.json(livros);
});

router.post('/livros', authenticateToken, async (req, res) => {
  try {
    const dados = { ...req.body, userId: req.user.id };
    const livro = await Livro.create(dados);
    res.status(201).json(livro);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar livro' });
  }
});

/**
 * @swagger
 * /api/livros/{id}:
 *   get:
 *     summary: Buscar livro por ID
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livro encontrado
 *       404:
 *         description: Livro não encontrado
 *   put:
 *     summary: Atualizar livro
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Livro atualizado
 *       404:
 *         description: Livro não encontrado
 *   delete:
 *     summary: Excluir livro
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livro excluído
 *       404:
 *         description: Livro não encontrado
 */
router.get('/livros/:id', authenticateToken, async (req, res) => {
  const livro = await Livro.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!livro) return res.status(404).json({ error: 'Livro não encontrado' });
  res.json(livro);
});

router.put('/livros/:id', authenticateToken, async (req, res) => {
  const livro = await Livro.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!livro) return res.status(404).json({ error: 'Livro não encontrado' });
  await livro.update(req.body);
  res.json(livro);
});

router.delete('/livros/:id', authenticateToken, async (req, res) => {
  const livro = await Livro.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!livro) return res.status(404).json({ error: 'Livro não encontrado' });
  await livro.destroy();
  res.json({ success: true });
});

module.exports = router; 