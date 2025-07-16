const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const User = require('../models/User')(sequelize, require('sequelize').DataTypes);
const Livro = require('../models/Livro')(sequelize, require('sequelize').DataTypes);
const SECRET = process.env.JWT_SECRET || 'jwtsecret';

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

// Cadastro
router.post('/register', async (req, res) => {
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

// Login
router.post('/login', async (req, res) => {
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