const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false, // Desabilita logs SQL em produção
  define: {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    underscored: true // Usa snake_case para nomes de colunas
  }
});

module.exports = sequelize; 