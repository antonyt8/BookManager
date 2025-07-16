const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true
  });

  // Criptografa a senha antes de salvar
  User.beforeCreate(async (user) => {
    user.senha = await bcrypt.hash(user.senha, 10);
  });

  // Método para validar senha
  User.prototype.validarSenha = async function(senha) {
    return bcrypt.compare(senha, this.senha);
  };

  return User;
}; 