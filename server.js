const app = require('./app');
const sequelize = require('./config/database');
const port = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida com sucesso.');
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados com o banco de dados.');
    app.listen(port, '0.0.0.0', () => {
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