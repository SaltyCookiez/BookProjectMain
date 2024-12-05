module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define("author", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    biography: {
      type: DataTypes.TEXT
    },
    birthDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
        isBefore: new Date().toISOString()
      }
    }
  }, {
    timestamps: true,
    tableName: 'authors'
  });

  Author.associate = (models) => {
    Author.hasMany(models.book, {
      foreignKey: 'authorId',
      as: 'books'
    });
  };

  return Author;
};
