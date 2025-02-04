const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database username
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Database host
    dialect: 'mysql', // Database dialect (e.g., mysql, postgres, etc.)
    logging: false, // Disable SQL logging (optional)
  }
);

module.exports = sequelize; // Ensure sequelize instance is exported

