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
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    emailConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    emailConfirmationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'users'
  });

  // Criptografa a senha antes de salvar
  User.beforeCreate(async (user) => {
    user.senha = await bcrypt.hash(user.senha, 10);
  });

  // Criptografa a senha antes de atualizar, se ela foi modificada
  User.beforeUpdate(async (user) => {
    if (user.changed('senha')) {
      user.senha = await bcrypt.hash(user.senha, 10);
    }
  });

  // Método para validar senha
  User.prototype.validarSenha = async function(senha) {
    return bcrypt.compare(senha, this.senha);
  };

  return User;
}; 