module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("book", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    isbn: {
      type: DataTypes.STRING,
      unique: true
    },
    publishedYear: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
        min: 1000,
        max: new Date().getFullYear()
      }
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0
      }
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'authors',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    tableName: 'books'
  });

  Book.associate = (models) => {
    Book.belongsTo(models.author, {
      foreignKey: 'authorId',
      as: 'author'
    });
  };

  return Book;
};
