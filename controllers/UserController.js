const User = require('../models/User');
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

// Instanciar modelo User
const UserModel = User(sequelize, DataTypes);

exports.cadastroForm = (req, res) => {
  res.render('cadastro', { titulo: 'Cadastro de Usuário' });
};

exports.cadastrar = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const existente = await UserModel.findOne({ where: { email } });
    if (existente) {
      req.flash('error', 'E-mail já cadastrado!');
      return res.redirect('/usuarios/cadastro');
    }
    await UserModel.create({ nome, email, senha });
    req.flash('success', 'Cadastro realizado com sucesso! Faça login.');
    res.redirect('/usuarios/login');
  } catch (err) {
    req.flash('error', 'Erro ao cadastrar usuário.');
    res.redirect('/usuarios/cadastro');
  }
};

exports.loginForm = (req, res) => {
  res.render('login', { titulo: 'Login' });
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user || !(await user.validarSenha(senha))) {
      req.flash('error', 'E-mail ou senha inválidos!');
      return res.redirect('/usuarios/login');
    }
    req.session.user = { id: user.id, nome: user.nome, email: user.email };
    req.flash('success', 'Login realizado com sucesso!');
    res.redirect('/livros');
  } catch (err) {
    req.flash('error', 'Erro ao fazer login.');
    res.redirect('/usuarios/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/usuarios/login');
  });
}; 