// require('dotenv').config(); // Comentado temporariamente
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
// const helmet = require('helmet'); // Comentado para compatibilidade com Node.js 14

// Importações da nova estrutura
const sequelize = require('./config/database');
const { Op } = require('sequelize');
const Livro = require('./models/Livro')(sequelize, require('sequelize').DataTypes);

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
app.get('/', (req, res) => {
  res.render('index', {
    titulo: 'BookManager - Gerenciador de Livros',
    descricao: 'Sistema simples e eficiente para gerenciar sua biblioteca pessoal'
  });
});

// Rotas de livros
const livrosRoutes = require('./routes/livros');
app.use('/livros', livrosRoutes);

// Rota para estatísticas (dashboard)
app.get('/dashboard', async (req, res) => {
  try {
    // Buscar dados para o dashboard
    const totalLivros = await Livro.count();
    const livrosLidos = await Livro.count({ where: { status: 'lido' } });
    const livrosLendo = await Livro.count({ where: { status: 'lendo' } });
    const livrosParaLer = await Livro.count({ where: { status: 'para_ler' } });
    
    // Buscar livros por gênero
    const livrosPorGenero = await Livro.findAll({
      attributes: [
        'genero',
        [sequelize.fn('COUNT', sequelize.col('id')), 'quantidade']
      ],
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
    const livrosAvaliados = await Livro.count({ where: { avaliacao: { [Op.not]: null } } });
    const totalAvaliacao = await Livro.sum('avaliacao');
    const mediaAvaliacao = livrosAvaliados > 0 ? totalAvaliacao / livrosAvaliados : 0;
    
    // Total de páginas
    const totalPaginas = await Livro.sum('paginas') || 0;
    const livrosComPaginas = await Livro.count({ where: { paginas: { [Op.not]: null } } });
    
    // Melhores avaliações
    const melhoresAvaliacoes = await Livro.findAll({
      where: { avaliacao: { [Op.not]: null } },
      order: [['avaliacao', 'DESC']],
      limit: 5,
      attributes: { include: ['created_at', 'updated_at'] }
    });
    
    // Livros recentes
    const livrosRecentes = await Livro.findAll({
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

// Inicialização do servidor
const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida com sucesso.');
    
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados com o banco de dados.');
    
    app.listen(port, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${port}`);
      console.log(`📚 BookManager iniciado com sucesso!`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

iniciarServidor(); 