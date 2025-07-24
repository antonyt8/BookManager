const app = require('./app');
const sequelize = require('./config/database');

// Configuração do servidor
const PORT = process.env.PORT || 3000;

// Debug de variáveis de ambiente para OAuth
console.log('🔧 Variáveis de ambiente OAuth:', {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...` : 'UNDEFINED',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'DEFINIDO' : 'UNDEFINED',
  NODE_ENV: process.env.NODE_ENV,
  SESSION_SECRET: process.env.SESSION_SECRET ? 'DEFINIDO' : 'UNDEFINED'
});

app.set('view engine', 'ejs');

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida com sucesso.');
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados com o banco de dados.');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📚 BookManager iniciado com sucesso!`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

iniciarServidor(); 