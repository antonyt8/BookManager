const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Livro = require('../models/Livro')(sequelize, require('sequelize').DataTypes);

class LivroController {
  // Listar livros com busca e paginação
  static async listar(req, res) {
    try {
      const busca = req.query.busca || '';
      const status = req.query.status || '';
      const formato = req.query.formato || '';
      const ordenacao = req.query.ordenacao || 'recentes';
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      
      let where = {};
      if (busca) {
        where = {
          [Op.or]: [
            { titulo: { [Op.like]: `%${busca}%` } },
            { autor: { [Op.like]: `%${busca}%` } },
            { genero: { [Op.like]: `%${busca}%` } },
            { editora: { [Op.like]: `%${busca}%` } },
            { tags: { [Op.like]: `%${busca}%` } }
          ]
        };
      }

      // Adicionar filtro de status
      if (status) {
        where.status = status;
      }

      // Adicionar filtro de formato
      if (formato) {
        where.formato = formato;
      }

      // Definir ordenação
      let order = [];
      switch (ordenacao) {
        case 'antigos':
          order = [['createdAt', 'ASC']];
          break;
        case 'titulo':
          order = [['titulo', 'ASC']];
          break;
        case 'autor':
          order = [['autor', 'ASC']];
          break;
        case 'avaliacao':
          order = [['avaliacao', 'DESC'], ['titulo', 'ASC']];
          break;
        default: // recentes
          order = [['createdAt', 'DESC']];
      }

      const livros = await Livro.findAll({
        where,
        limit,
        offset,
        order
      });

      const count = await Livro.count({ where });
      const totalPages = Math.max(1, Math.ceil(count / limit));
      
      res.render('livros', { 
        livros, 
        busca, 
        status,
        formato,
        ordenacao,
        page, 
        totalPages,
        totalLivros: count
      });
    } catch (error) {
      console.error('Erro ao listar livros:', error);
      res.render('livros', { 
        livros: [], 
        busca: req.query.busca || '', 
        status: req.query.status || '',
        formato: req.query.formato || '',
        ordenacao: req.query.ordenacao || 'recentes',
        page: 1, 
        totalPages: 1, 
        error: 'Erro ao buscar livros: ' + error.message,
        totalLivros: 0
      });
    }
  }

  // Mostrar formulário para novo livro
  static mostrarFormulario(req, res) {
    res.render('form', { 
      livro: null, 
      acao: '/livros/novo', 
      erros: [],
      titulo: 'Novo Livro'
    });
  }

  // Criar novo livro
  static async criar(req, res) {
    const erros = validationResult(req);
    
    if (!erros.isEmpty()) {
      return res.render('form', {
        livro: req.body,
        acao: '/livros/novo',
        erros: erros.array(),
        titulo: 'Novo Livro'
      });
    }

    try {
      // Tratar campos vazios
      const dadosLivro = { ...req.body };
      
      // Converter campos vazios para null
      const camposParaTratar = ['genero', 'isbn', 'descricao', 'editora', 'idioma', 'formato', 'tags', 'notas'];
      camposParaTratar.forEach(campo => {
        if (dadosLivro[campo] === '') {
          dadosLivro[campo] = null;
        }
      });
      
      // Tratar campos numéricos
      if (dadosLivro.ano === '') dadosLivro.ano = null;
      if (dadosLivro.paginas === '') dadosLivro.paginas = null;
      if (dadosLivro.avaliacao === '') dadosLivro.avaliacao = null;
      
      // Tratar datas
      if (dadosLivro.data_inicio === '') dadosLivro.data_inicio = null;
      if (dadosLivro.data_conclusao === '') dadosLivro.data_conclusao = null;
      
      const novoLivro = await Livro.create(dadosLivro);
      req.flash('success', 'Livro cadastrado com sucesso!');
      res.redirect('/livros');
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      req.flash('error', 'Erro ao criar livro: ' + error.message);
      res.redirect('/livros');
    }
  }

  // Mostrar formulário para editar livro
  static async mostrarFormularioEdicao(req, res) {
    try {
      const livro = await Livro.findByPk(req.params.id);
      if (!livro) {
        req.flash('error', 'Livro não encontrado');
        return res.redirect('/livros');
      }
      
      res.render('form', { 
        livro, 
        acao: `/livros/editar/${req.params.id}`, 
        erros: [],
        titulo: 'Editar Livro'
      });
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      req.flash('error', 'Erro ao buscar livro: ' + error.message);
      res.redirect('/livros');
    }
  }

  // Atualizar livro
  static async atualizar(req, res) {
    const erros = validationResult(req);
    
    try {
      const livro = await Livro.findByPk(req.params.id);
      if (!livro) {
        req.flash('error', 'Livro não encontrado');
        return res.redirect('/livros');
      }

      if (!erros.isEmpty()) {
        return res.render('form', {
          livro: { ...req.body, id: req.params.id },
          acao: `/livros/editar/${req.params.id}`,
          erros: erros.array(),
          titulo: 'Editar Livro'
        });
      }

      // Tratar campos vazios
      const dadosLivro = { ...req.body };
      
      // Converter campos vazios para null
      const camposParaTratar = ['genero', 'isbn', 'descricao', 'editora', 'idioma', 'formato', 'tags', 'notas'];
      camposParaTratar.forEach(campo => {
        if (dadosLivro[campo] === '') {
          dadosLivro[campo] = null;
        }
      });
      
      // Tratar campos numéricos
      if (dadosLivro.ano === '') dadosLivro.ano = null;
      if (dadosLivro.paginas === '') dadosLivro.paginas = null;
      if (dadosLivro.avaliacao === '') dadosLivro.avaliacao = null;
      
      // Tratar datas
      if (dadosLivro.data_inicio === '') dadosLivro.data_inicio = null;
      if (dadosLivro.data_conclusao === '') dadosLivro.data_conclusao = null;
      
      await livro.update(dadosLivro);
      req.flash('success', 'Livro atualizado com sucesso!');
      res.redirect('/livros');
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      req.flash('error', 'Erro ao atualizar livro: ' + error.message);
      res.redirect('/livros');
    }
  }

  // Excluir livro
  static async excluir(req, res) {
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
      console.error('Erro ao excluir livro:', error);
      req.flash('error', 'Erro ao excluir livro: ' + error.message);
      res.redirect('/livros');
    }
  }

  // Buscar livro por ID (para API)
  static async buscarPorId(req, res) {
    try {
      const livro = await Livro.findByPk(req.params.id);
      if (!livro) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      res.json(livro);
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = LivroController; 