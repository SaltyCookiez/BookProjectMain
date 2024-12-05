module.exports = {
  HOST: "localhost",  // Using IP instead of localhost
  USER: "root",
  PASSWORD: "12345",
  DB: "bookdb",
  dialect: "mysql",
  port: 3307,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};