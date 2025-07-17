const User = require('../models/User');
const sequelize = require('../config/database');
const { DataTypes, Op } = require('sequelize');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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
    const token = crypto.randomBytes(32).toString('hex');
    const user = await UserModel.create({ nome, email, senha, emailConfirmationToken: token });
    // Enviar e-mail de confirmação
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const confirmUrl = `${req.protocol}://${req.get('host')}/usuarios/confirmar/${token}`;
    await transporter.sendMail({
      to: user.email,
      subject: 'Confirmação de E-mail - BookManager',
      html: `<p>Olá, ${user.nome}!</p><p>Para ativar sua conta, clique no link abaixo:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p><p>Se não foi você, ignore este e-mail.</p>`
    });
    req.flash('success', 'Cadastro realizado! Confirme seu e-mail para ativar a conta.');
    res.redirect('/usuarios/login');
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    req.flash('error', 'Erro ao cadastrar usuário.');
    res.redirect('/usuarios/cadastro');
  }
};

exports.confirmarEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await UserModel.findOne({ where: { emailConfirmationToken: token } });
    if (!user) {
      req.flash('error', 'Token inválido ou expirado.');
      return res.redirect('/usuarios/login');
    }
    user.emailConfirmed = true;
    user.emailConfirmationToken = null;
    await user.save();
    req.flash('success', 'E-mail confirmado! Agora você pode fazer login.');
    res.redirect('/usuarios/login');
  } catch (err) {
    req.flash('error', 'Erro ao confirmar e-mail.');
    res.redirect('/usuarios/login');
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

exports.solicitarRecuperacao = (req, res) => {
  res.render('recuperar', { titulo: 'Recuperar Senha' });
};

exports.enviarRecuperacao = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      req.flash('error', 'E-mail não encontrado!');
      return res.redirect('/usuarios/recuperar');
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora
    await user.update({ passwordResetToken: token, passwordResetExpires: expires });
    const resetUrl = `${req.protocol}://${req.get('host')}/usuarios/redefinir/${token}`;
    // Tenta enviar o e-mail normalmente
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      await transporter.sendMail({
        to: user.email,
        subject: 'Recuperação de Senha - BookManager',
        html: `<p>Olá, ${user.nome}!</p><p>Para redefinir sua senha, clique no link abaixo:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Se não solicitou, ignore este e-mail.</p>`
      });
      req.flash('success', 'E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      return res.render('recuperar', { titulo: 'Recuperar Senha', resetUrl });
    } catch (err) {
      // Se falhar, exibe o link na tela
      req.flash('error', 'Não foi possível enviar o e-mail. Use o link abaixo para redefinir sua senha.');
      return res.render('recuperar', { titulo: 'Recuperar Senha', resetUrl });
    }
  } catch (err) {
    req.flash('error', 'Erro ao enviar e-mail de recuperação.');
    res.redirect('/usuarios/recuperar');
  }
};

exports.mostrarRedefinirSenha = async (req, res) => {
  const { token } = req.params;
  try {
    console.log('Token recebido para redefinição:', token);
    const user = await UserModel.findOne({ where: { passwordResetToken: token, passwordResetExpires: { [Op.gt]: new Date() } } });
    if (!user) {
      console.warn('Token inválido ou expirado:', token);
      req.flash('error', 'Token inválido ou expirado.');
      return res.redirect('/usuarios/recuperar');
    }
    console.log('Usuário encontrado para redefinição de senha:', user.email);
    res.render('redefinir', { titulo: 'Redefinir Senha', token });
  } catch (err) {
    console.error('Erro ao validar token de redefinição:', err);
    req.flash('error', 'Erro ao validar token.');
    res.redirect('/usuarios/recuperar');
  }
};

exports.redefinirSenha = async (req, res) => {
  const { token } = req.params;
  const { senha } = req.body;
  try {
    const user = await UserModel.findOne({ where: { passwordResetToken: token, passwordResetExpires: { [Op.gt]: new Date() } } });
    if (!user) {
      req.flash('error', 'Token inválido ou expirado.');
      return res.redirect('/usuarios/recuperar');
    }
    user.senha = senha;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    req.flash('success', 'Senha redefinida com sucesso! Faça login.');
    res.redirect('/usuarios/login');
  } catch (err) {
    req.flash('error', 'Erro ao redefinir senha.');
    res.redirect('/usuarios/recuperar');
  }
};

exports.perfil = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.session.user.id);
    res.render('perfil', { titulo: 'Meu Perfil', user, erros: [] });
  } catch (err) {
    req.flash('error', 'Erro ao carregar perfil.');
    res.redirect('/');
  }
};

exports.atualizarPerfil = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.session.user.id);
    const { nome, email, senha } = req.body;
    let erros = [];
    if (!nome || !email) {
      erros.push({ msg: 'Nome e e-mail são obrigatórios.' });
    }
    // Verificar se o e-mail já está em uso por outro usuário
    const existente = await UserModel.findOne({ where: { email } });
    if (existente && existente.id !== user.id) {
      erros.push({ msg: 'E-mail já cadastrado por outro usuário.' });
    }
    if (erros.length > 0) {
      return res.render('perfil', { titulo: 'Meu Perfil', user, erros });
    }
    user.nome = nome;
    user.email = email;
    if (senha) user.senha = senha;
    // Upload de avatar
    if (req.file) {
      user.avatar_url = '/uploads/' + req.file.filename;
    }
    await user.save();
    req.session.user.nome = user.nome;
    req.session.user.email = user.email;
    req.session.user.avatar_url = user.avatar_url;
    req.flash('success', 'Perfil atualizado com sucesso!');
    res.redirect('/usuarios/perfil');
  } catch (err) {
    req.flash('error', 'Erro ao atualizar perfil.');
    res.redirect('/usuarios/perfil');
  }
}; 