const User = require('../models/User');
const Livro = require('../models/Livro');
const sequelize = require('../config/database');
const { DataTypes, Op } = require('sequelize');
const UserModel = User(sequelize, DataTypes);
const LivroModel = Livro(sequelize, DataTypes);

exports.dashboard = async (req, res) => {
  const totalUsuarios = await UserModel.count();
  const totalLivros = await LivroModel.count();
  const livrosPorStatus = await LivroModel.findAll({
    attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'quantidade']],
    group: ['status']
  });
  res.render('admin/dashboard', { totalUsuarios, totalLivros, livrosPorStatus });
};

exports.listarUsuarios = async (req, res) => {
  const usuarios = await UserModel.findAll();
  res.render('admin/usuarios', { usuarios });
};

exports.promoverAdmin = async (req, res) => {
  const user = await UserModel.findByPk(req.params.id);
  if (user) {
    user.isAdmin = true;
    await user.save();
  }
  res.redirect('/admin/usuarios');
};

exports.demoverAdmin = async (req, res) => {
  const user = await UserModel.findByPk(req.params.id);
  if (user) {
    user.isAdmin = false;
    await user.save();
  }
  res.redirect('/admin/usuarios');
};

exports.excluirUsuario = async (req, res) => {
  const user = await UserModel.findByPk(req.params.id);
  if (user) {
    await user.destroy();
  }
  res.redirect('/admin/usuarios');
};

exports.listarLivros = async (req, res) => {
  const livros = await LivroModel.findAll({ include: [{ model: UserModel, as: 'user' }] });
  res.render('admin/livros', { livros });
}; 