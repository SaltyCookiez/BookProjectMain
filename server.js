require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
require("./routes/book.routes")(app);
require("./routes/author.routes")(app);

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Book Management application." });
});

// Sync database
db.sequelize.sync()
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

// Set port and listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});