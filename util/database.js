const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME || 'car-service', process.env.DB_USER || 'root', process.env.DB_PASSWORD || 'password', {
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
});

module.exports = sequelize;
