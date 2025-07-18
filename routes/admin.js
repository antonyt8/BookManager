const express = require('express');
const router = express.Router();
const admin = require('../middleware/admin');
const sequelize = require('../config/database');
const User = require('../models/User')(sequelize, require('sequelize').DataTypes);
const Livro = require('../models/Livro')(sequelize, require('sequelize').DataTypes);

// Dashboard admin
router.get('/dashboard', admin, async (req, res) => {
  const totalUsuarios = await User.count();
  const totalLivros = await Livro.count();
  const livrosPorStatus = await Livro.findAll({
    attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'quantidade']],
    group: ['status']
  });
  res.render('admin/dashboard', { totalUsuarios, totalLivros, livrosPorStatus });
});

// Listar usuários
router.get('/usuarios', admin, async (req, res) => {
  const usuarios = await User.findAll();
  res.render('admin/usuarios', { usuarios });
});

// Listar livros
router.get('/livros', admin, async (req, res) => {
  const livros = await Livro.findAll({ include: [{ model: User, attributes: ['nome', 'email'] }] });
  res.render('admin/livros', { livros });
});

module.exports = router; 