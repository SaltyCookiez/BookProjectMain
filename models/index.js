const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  pool: dbConfig.pool
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.books = require("./book.model.js")(sequelize, Sequelize);
db.authors = require("./author.model.js")(sequelize, Sequelize);

db.authors.hasMany(db.books, { as: "books" });
db.books.belongsTo(db.authors, {
  foreignKey: "authorId",
  as: "author",
});

module.exports = db;