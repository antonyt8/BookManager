module.exports = (sequelize, DataTypes) => {
  const Livro = sequelize.define('Livro', {
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 200]
      }
    },
    autor: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1000,
        max: new Date().getFullYear() + 1
      }
    },
    genero: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: {
          args: [2, 50],
          msg: 'Gênero deve ter entre 2 e 50 caracteres'
        }
      }
    },
    isbn: {
      type: DataTypes.STRING(13),
      allowNull: true,
      validate: {
        len: {
          args: [10, 13],
          msg: 'ISBN deve ter entre 10 e 13 caracteres'
        }
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
    },
    avaliacao: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    status: {
      type: DataTypes.ENUM('lido', 'lendo', 'para_ler'),
      allowNull: true,
      defaultValue: 'para_ler'
    },
    capa_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    data_conclusao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paginas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    editora: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    idioma: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    formato: {
      type: DataTypes.ENUM('Físico', 'E-book', 'Audiobook', 'PDF'),
      allowNull: true
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tags: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'livros',
    timestamps: true,
    underscored: true
  });

  Livro.associate = (models) => {
    Livro.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  // Métodos de instância
  Livro.prototype.getAvaliacaoTexto = function() {
    if (!this.avaliacao) return 'Não avaliado';
    const estrelas = '⭐'.repeat(this.avaliacao);
    return `${estrelas} (${this.avaliacao}/5)`;
  };

  Livro.prototype.getStatusTexto = function() {
    const statusMap = {
      'lido': 'Lido',
      'lendo': 'Lendo',
      'para_ler': 'Para Ler'
    };
    return statusMap[this.status] || this.status;
  };

  // Métodos de classe (estáticos)
  Livro.getEstatisticas = async function() {
    const total = await this.count();
    const porStatus = await this.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'quantidade']
      ],
      group: ['status']
    });
    
    const porGenero = await this.findAll({
      attributes: [
        'genero',
        [sequelize.fn('COUNT', sequelize.col('id')), 'quantidade']
      ],
      group: ['genero'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10
    });

    return {
      total,
      porStatus,
      porGenero
    };
  };

  return Livro;
}; 