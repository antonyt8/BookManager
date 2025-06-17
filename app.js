const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

// Inicialização do Express
const app = express();
const port = 3000;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Configuração do Sequelize com SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Definição do modelo Livro
const Livro = sequelize.define('Livro', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  autor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Rotas
app.get('/', (req, res) => {
  res.render('index');
});

// Listar todos os livros
app.get('/livros', async (req, res) => {
  try {
    const livros = await Livro.findAll();
    res.render('livros', { livros });
  } catch (error) {
    res.status(500).send('Erro ao buscar livros: ' + error.message);
  }
});

// Formulário para novo livro
app.get('/livros/novo', (req, res) => {
  res.render('form', { livro: {}, acao: '/livros/novo' });
});

// Criar novo livro
app.post('/livros/novo', async (req, res) => {
  try {
    await Livro.create(req.body);
    res.redirect('/livros');
  } catch (error) {
    res.status(500).send('Erro ao criar livro: ' + error.message);
  }
});

// Formulário para editar livro
app.get('/livros/editar/:id', async (req, res) => {
  try {
    const livro = await Livro.findByPk(req.params.id);
    if (!livro) {
      return res.status(404).send('Livro não encontrado');
    }
    res.render('form', { livro, acao: `/livros/editar/${req.params.id}` });
  } catch (error) {
    res.status(500).send('Erro ao buscar livro: ' + error.message);
  }
});

// Atualizar livro
app.post('/livros/editar/:id', async (req, res) => {
  try {
    const livro = await Livro.findByPk(req.params.id);
    if (!livro) {
      return res.status(404).send('Livro não encontrado');
    }
    await livro.update(req.body);
    res.redirect('/livros');
  } catch (error) {
    res.status(500).send('Erro ao atualizar livro: ' + error.message);
  }
});

// Excluir livro
app.post('/livros/deletar/:id', async (req, res) => {
  try {
    const livro = await Livro.findByPk(req.params.id);
    if (!livro) {
      return res.status(404).send('Livro não encontrado');
    }
    await livro.destroy();
    res.redirect('/livros');
  } catch (error) {
    res.status(500).send('Erro ao excluir livro: ' + error.message);
  }
});

// Inicialização do servidor
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}); 