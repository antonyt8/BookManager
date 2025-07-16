const request = require('supertest');
const app = require('../app');

describe('Autenticação de Usuário', () => {
  it('deve cadastrar um novo usuário', async () => {
    const res = await request(app)
      .post('/usuarios/cadastro')
      .send({ nome: 'Teste', email: 'teste@example.com', senha: '123456' });
    expect(res.statusCode).toBe(302); // Redireciona após cadastro
  });

  it('deve fazer login com usuário cadastrado', async () => {
    const agent = request.agent(app);
    await agent
      .post('/usuarios/cadastro')
      .send({ nome: 'Login', email: 'login@example.com', senha: '123456' });
    const res = await agent
      .post('/usuarios/login')
      .send({ email: 'login@example.com', senha: '123456' });
    expect(res.statusCode).toBe(302); // Redireciona após login
  });
}); 