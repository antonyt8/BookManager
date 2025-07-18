const request = require('supertest');
const app = require('../app');
const { sequelize, User, Livro } = require('../models');

// Associações explícitas
User.hasMany(Livro, { foreignKey: 'userId' });
Livro.belongsTo(User, { foreignKey: 'userId' });

describe('Recuperação de Senha', () => {
  let user;
  let resetToken;

  beforeAll(async () => {
    // Limpa e cria usuário de teste
    await sequelize.sync({ force: true });
    user = await User.create({ nome: 'Recupera', email: 'recupera@example.com', senha: 'original123', emailConfirmed: true });
  });

  it('deve solicitar recuperação de senha com e-mail válido', async () => {
    const res = await request(app)
      .post('/usuarios/recuperar')
      .send({ email: user.email });
    expect(res.statusCode).toBe(200);
    // Busca token gerado no banco
    const atualizado = await User.findOne({ where: { email: user.email } });
    expect(atualizado.passwordResetToken).toBeTruthy();
    resetToken = atualizado.passwordResetToken;
  });

  it('não deve solicitar recuperação com e-mail inexistente', async () => {
    const res = await request(app)
      .post('/usuarios/recuperar')
      .send({ email: 'naoexiste@example.com' });
    expect(res.statusCode).toBe(302); // Redireciona
  });

  it('deve acessar formulário de redefinição com token válido', async () => {
    const res = await request(app)
      .get(`/usuarios/redefinir/${resetToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Redefinir Senha/);
  });

  it('não deve acessar redefinição com token inválido', async () => {
    const res = await request(app)
      .get('/usuarios/redefinir/tokeninvalido');
    expect(res.statusCode).toBe(302); // Redireciona
  });

  it('deve redefinir senha com token válido', async () => {
    const res = await request(app)
      .post(`/usuarios/redefinir/${resetToken}`)
      .send({ senha: 'novaSenha123' });
    expect(res.statusCode).toBe(302); // Redireciona após sucesso
    // Confirma que o token foi removido
    const atualizado = await User.findOne({ where: { email: user.email } });
    expect(atualizado.passwordResetToken).toBeNull();
  });

  it('deve permitir login com a nova senha', async () => {
    const res = await request(app)
      .post('/usuarios/login')
      .send({ email: user.email, senha: 'novaSenha123' });
    expect(res.statusCode).toBe(302); // Redireciona após login
  });
}); 