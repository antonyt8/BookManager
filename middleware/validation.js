const { check } = require('express-validator');

const livroValidation = [
  check('titulo')
    .notEmpty().withMessage('Título é obrigatório')
    .isLength({ min: 2, max: 200 }).withMessage('Título deve ter entre 2 e 200 caracteres')
    .trim().escape(),
  check('autor')
    .notEmpty().withMessage('Autor é obrigatório')
    .isLength({ min: 2, max: 100 }).withMessage('Autor deve ter entre 2 e 100 caracteres')
    .trim().escape(),
  check('ano')
    .optional({ checkFalsy: true })
    .isInt({ min: 1000, max: new Date().getFullYear() + 1 })
    .withMessage('Ano deve ser entre 1000 e o próximo ano'),
  check('genero')
    .optional({ checkFalsy: true })
    .isLength({ min: 2, max: 50 }).withMessage('Gênero deve ter entre 2 e 50 caracteres')
    .trim().escape(),
  check('isbn')
    .optional({ checkFalsy: true })
    .isLength({ min: 10, max: 20 }).withMessage('ISBN deve ter entre 10 e 20 caracteres')
    .trim().escape(),
  check('descricao')
    .optional({ checkFalsy: true })
    .isLength({ max: 1000 }).withMessage('Descrição deve ter no máximo 1000 caracteres')
    .trim().escape(),
  check('avaliacao')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 5 }).withMessage('Avaliação deve ser entre 1 e 5'),
  check('status')
    .notEmpty().withMessage('Status é obrigatório')
    .isIn(['lido', 'lendo', 'para_ler']).withMessage('Status deve ser: lido, lendo ou para_ler'),
  check('paginas')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Páginas deve ser um número positivo'),
  check('editora')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 }).withMessage('Editora deve ter no máximo 100 caracteres')
    .trim().escape(),
  check('idioma')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Idioma deve ter no máximo 50 caracteres')
    .trim().escape(),
  check('formato')
    .optional({ checkFalsy: true })
    .isIn(['Físico', 'E-book', 'Audiobook', 'PDF']).withMessage('Formato inválido'),
  check('notas')
    .optional({ checkFalsy: true })
    .isLength({ max: 1000 }).withMessage('Notas devem ter no máximo 1000 caracteres')
    .trim().escape(),
  check('tags')
    .optional({ checkFalsy: true })
    .isLength({ max: 200 }).withMessage('Tags devem ter no máximo 200 caracteres')
    .trim().escape()
];

module.exports = {
  livroValidation
}; 