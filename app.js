const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const session = require('express-session');
const flash = require('connect-flash');
const { check, validationResult } = require('express-validator');
const helmet = require('helmet');

// Inicialização do Express
const app = express();
const port = 3000;

// Helmet para segurança
app.use(helmet());

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Sessão e flash
app.use(session({
  secret: 'livros123',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Configuração do Sequelize com SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Importar modelo Livro
const Livro = require('./models/Livro')(sequelize, DataTypes);

// Rotas
app.get('/', (req, res) => {
  res.render('index');
});

// Listar todos os livros com busca e paginação
app.get('/livros', async (req, res) => {
  try {
    const busca = req.query.busca || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    let where = {};
    if (busca) {
      where.titulo = { [Sequelize.Op.like]: `%${busca}%` };
    }
    const { count, rows: livros } = await Livro.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']]
    });
    const totalPages = Math.max(1, Math.ceil(count / limit));
    res.render('livros', { livros, busca, page, totalPages });
  } catch (error) {
    res.render('livros', { livros: [], busca: req.query.busca || '', page: 1, totalPages: 1, error: 'Erro ao buscar livros: ' + error.message });
  }
});

// Formulário para novo livro
app.get('/livros/novo', (req, res) => {
  res.render('form', { livro: {}, acao: '/livros/novo', erros: [] });
});

// Criar novo livro com validação
app.post('/livros/novo',
  [
    check('titulo')
      .notEmpty().withMessage('Título é obrigatório')
      .isLength({ min: 2, max: 100 }).withMessage('Título deve ter entre 2 e 100 caracteres')
      .trim().escape(),
    check('autor')
      .notEmpty().withMessage('Autor é obrigatório')
      .isLength({ min: 2, max: 100 }).withMessage('Autor deve ter entre 2 e 100 caracteres')
      .trim().escape(),
    check('ano')
      .isInt({ min: 0, max: new Date().getFullYear() })
      .withMessage('Ano inválido'),
    check('genero')
      .notEmpty().withMessage('Gênero é obrigatório')
      .isLength({ min: 2, max: 50 }).withMessage('Gênero deve ter entre 2 e 50 caracteres')
      .trim().escape(),
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.render('form', {
        livro: req.body,
        acao: '/livros/novo',
        erros: erros.array()
      });
    }
    try {
      await Livro.create(req.body);
      req.flash('success', 'Livro cadastrado com sucesso!');
      res.redirect('/livros');
    } catch (error) {
      req.flash('error', 'Erro ao criar livro: ' + error.message);
      res.redirect('/livros');
    }
  }
);

// Formulário para editar livro
app.get('/livros/editar/:id', async (req, res) => {
  try {
    const livro = await Livro.findByPk(req.params.id);
    if (!livro) {
      req.flash('error', 'Livro não encontrado');
      return res.redirect('/livros');
    }
    res.render('form', { livro, acao: `/livros/editar/${req.params.id}`, erros: [] });
  } catch (error) {
    req.flash('error', 'Erro ao buscar livro: ' + error.message);
    res.redirect('/livros');
  }
});

// Atualizar livro com validação
app.post('/livros/editar/:id',
  [
    check('titulo')
      .notEmpty().withMessage('Título é obrigatório')
      .isLength({ min: 2, max: 100 }).withMessage('Título deve ter entre 2 e 100 caracteres')
      .trim().escape(),
    check('autor')
      .notEmpty().withMessage('Autor é obrigatório')
      .isLength({ min: 2, max: 100 }).withMessage('Autor deve ter entre 2 e 100 caracteres')
      .trim().escape(),
    check('ano')
      .isInt({ min: 0, max: new Date().getFullYear() })
      .withMessage('Ano inválido'),
    check('genero')
      .notEmpty().withMessage('Gênero é obrigatório')
      .isLength({ min: 2, max: 50 }).withMessage('Gênero deve ter entre 2 e 50 caracteres')
      .trim().escape(),
  ],
  async (req, res) => {
    const erros = validationResult(req);
    const livro = await Livro.findByPk(req.params.id);
    if (!livro) {
      req.flash('error', 'Livro não encontrado');
      return res.redirect('/livros');
    }
    if (!erros.isEmpty()) {
      return res.render('form', {
        livro: { ...req.body, id: req.params.id },
        acao: `/livros/editar/${req.params.id}`,
        erros: erros.array()
      });
    }
    try {
      await livro.update(req.body);
      req.flash('success', 'Livro atualizado com sucesso!');
      res.redirect('/livros');
    } catch (error) {
      req.flash('error', 'Erro ao atualizar livro: ' + error.message);
      res.redirect('/livros');
    }
  }
);

// Excluir livro
app.post('/livros/deletar/:id', async (req, res) => {
  try {
    const livro = await Livro.findByPk(req.params.id);
    if (!livro) {
      req.flash('error', 'Livro não encontrado');
      return res.redirect('/livros');
    }
    await livro.destroy();
    req.flash('success', 'Livro excluído com sucesso!');
    res.redirect('/livros');
  } catch (error) {
    req.flash('error', 'Erro ao excluir livro: ' + error.message);
    res.redirect('/livros');
  }
});

// Inicialização do servidor
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}); 