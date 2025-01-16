module.exports = {
  HOST: "bookprojectmain-server.mysql.database.azure.com",
  USER: "tfykinpshu",
  PASSWORD: "ygAPVA7ZeKg8tNx$",
  DB: "bookdb",
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 60000
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};