const { Sequelize } = require('sequelize');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

let sequelize;

if (process.env.DATABASE_URL) {
  // Usar DATABASE_URL se disponível (ambiente de produção como Fly.io)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  });
} else {
  // Usar configuração individual para desenvolvimento/teste
  sequelize = new Sequelize(
    isTest ? process.env.DB_TEST_NAME : process.env.DB_NAME,
    isTest ? process.env.DB_TEST_USER : process.env.DB_USER,
    isTest ? process.env.DB_TEST_PASS : process.env.DB_PASS,
    {
      host: isTest ? process.env.DB_TEST_HOST : process.env.DB_HOST || 'localhost',
      port: isTest ? process.env.DB_TEST_PORT : process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      define: {
        timestamps: true,
        underscored: true
      }
    }
  );
}

module.exports = sequelize; 