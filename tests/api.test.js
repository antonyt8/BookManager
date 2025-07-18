const request = require('supertest');
const app = require('../app');
const { sequelize, User, Livro } = require('../models');

// Associações explícitas
User.hasMany(Livro, { foreignKey: 'userId' });
Livro.belongsTo(User, { foreignKey: 'userId' });

describe('API RESTful - Autenticação e Livros', () => {
  let token;
  let livroId;
  const user = { nome: 'ApiUser', email: 'apiuser@example.com', senha: '123456' };

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  it('deve cadastrar um novo usuário via API', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('deve fazer login e receber um token JWT', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: user.email, senha: user.senha });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('deve criar um novo livro', async () => {
    const res = await request(app)
      .post('/api/livros')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Livro API', autor: 'Autor API', status: 'para_ler' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    livroId = res.body.id;
  });

  it('deve listar livros do usuário', async () => {
    const res = await request(app)
      .get('/api/livros')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('deve buscar um livro por ID', async () => {
    const res = await request(app)
      .get(`/api/livros/${livroId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', livroId);
  });

  it('deve atualizar um livro', async () => {
    const res = await request(app)
      .put(`/api/livros/${livroId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Livro API Editado' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('titulo', 'Livro API Editado');
  });

  it('deve excluir um livro', async () => {
    const res = await request(app)
      .delete(`/api/livros/${livroId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
}); 