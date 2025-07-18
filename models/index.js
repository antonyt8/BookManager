const sequelize = require('../config/database');
const User = require('./User')(sequelize, require('sequelize').DataTypes);
const Livro = require('./Livro')(sequelize, require('sequelize').DataTypes);

User.hasMany(Livro, { foreignKey: 'userId' });
Livro.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Livro }; 