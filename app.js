// require('dotenv').config(); // Comentado temporariamente
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
// const helmet = require('helmet'); // Comentado para compatibilidade com Node.js 14

// Importações da nova estrutura
const sequelize = require('./config/database');
const { Op } = require('sequelize');
const User = require('./models/User')(sequelize, require('sequelize').DataTypes);
const Livro = require('./models/Livro')(sequelize, require('sequelize').DataTypes);

// Associação
Livro.associate && Livro.associate({ User });
User.hasMany(Livro, { foreignKey: 'userId', as: 'livros' });

// Inicialização do Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware de segurança (simplificado para compatibilidade)
// app.use(helmet()); // Comentado para compatibilidade com Node.js 14

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração de sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'livros123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Flash messages
app.use(flash());

// Middleware global para variáveis locais
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  res.locals.currentYear = new Date().getFullYear();
  next();
});

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas
app.get('/', async (req, res) => {
  try {
    const userId = req.session.user?.id;
    let totalLivros = 0, livrosLidos = 0, livrosLendo = 0, livrosParaLer = 0;
    if (userId) {
      const where = { userId };
      totalLivros = await Livro.count({ where });
      livrosLidos = await Livro.count({ where: { ...where, status: 'lido' } });
      livrosLendo = await Livro.count({ where: { ...where, status: 'lendo' } });
      livrosParaLer = await Livro.count({ where: { ...where, status: 'para_ler' } });
    }
    res.render('index', {
      titulo: 'BookManager - Gerenciador de Livros',
      descricao: 'Sistema simples e eficiente para gerenciar sua biblioteca pessoal',
      totalLivros,
      livrosLidos,
      livrosLendo,
      livrosParaLer
    });
  } catch (error) {
    console.error('Erro ao carregar página inicial:', error);
    res.render('index', {
      titulo: 'BookManager - Gerenciador de Livros',
      descricao: 'Sistema simples e eficiente para gerenciar sua biblioteca pessoal',
      totalLivros: 0,
      livrosLidos: 0,
      livrosLendo: 0,
      livrosParaLer: 0
    });
  }
});

// Rotas de livros
const livrosRoutes = require('./routes/livros');
app.use('/livros', livrosRoutes);

const usuariosRoutes = require('./routes/usuarios');
app.use('/usuarios', usuariosRoutes);

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Rota para estatísticas (dashboard)
app.get('/dashboard', async (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Você precisa estar logado para acessar o dashboard.');
    return res.redirect('/usuarios/login');
  }
  try {
    const userId = req.session.user.id;
    const where = { userId };
    const totalLivros = await Livro.count({ where });
    const livrosLidos = await Livro.count({ where: { ...where, status: 'lido' } });
    const livrosLendo = await Livro.count({ where: { ...where, status: 'lendo' } });
    const livrosParaLer = await Livro.count({ where: { ...where, status: 'para_ler' } });
    
    // Buscar livros por gênero
    const livrosPorGenero = await Livro.findAll({
      attributes: [
        'genero',
        [sequelize.fn('COUNT', sequelize.col('id')), 'quantidade']
      ],
      where,
      group: ['genero'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });
    
    // Converter para objeto
    const generoStats = {};
    livrosPorGenero.forEach(item => {
      generoStats[item.genero] = parseInt(item.dataValues.quantidade);
    });
    
    // Gênero favorito
    const generoFavorito = Object.keys(generoStats).length > 0 
      ? Object.keys(generoStats).reduce((a, b) => generoStats[a] > generoStats[b] ? a : b)
      : null;
    
    // Média de avaliação
    const livrosAvaliados = await Livro.count({ where: { ...where, avaliacao: { [Op.not]: null } } });
    const totalAvaliacao = await Livro.sum('avaliacao', { where });
    const mediaAvaliacao = livrosAvaliados > 0 ? totalAvaliacao / livrosAvaliados : 0;
    
    // Total de páginas
    const totalPaginas = await Livro.sum('paginas', { where }) || 0;
    const livrosComPaginas = await Livro.count({ where: { ...where, paginas: { [Op.not]: null } } });
    
    // Melhores avaliações
    const melhoresAvaliacoes = await Livro.findAll({
      where: { ...where, avaliacao: { [Op.not]: null } },
      order: [['avaliacao', 'DESC']],
      limit: 5,
      attributes: { include: ['created_at', 'updated_at'] }
    });
    
    // Livros recentes
    const livrosRecentes = await Livro.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: { include: ['created_at', 'updated_at'] }
    });
    
    res.render('dashboard', {
      totalLivros,
      livrosLidos,
      livrosLendo,
      livrosParaLer,
      livrosPorGenero: generoStats,
      generoFavorito,
      mediaAvaliacao,
      livrosAvaliados,
      totalPaginas,
      livrosComPaginas,
      melhoresAvaliacoes,
      livrosRecentes
    });
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    req.flash('error', 'Erro ao carregar estatísticas');
    res.redirect('/');
  }
});

// Middleware de tratamento de erros 404
app.use((req, res) => {
  res.status(404).render('404', {
    titulo: 'Página não encontrada',
    mensagem: 'A página que você está procurando não existe.'
  });
});

// Middleware de tratamento de erros globais
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).render('error', {
    titulo: 'Erro interno',
    mensagem: 'Ocorreu um erro interno no servidor.',
    error: process.env.NODE_ENV === 'development' ? error : {}
  });
});

// Remover a inicialização do servidor daqui
module.exports = app; 