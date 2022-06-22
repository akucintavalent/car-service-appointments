const Sequelize = require('sequelize');

const sequelize = new Sequelize('car-service', 'root', 'password', { 
  dialect: 'mysql', 
  host: 'localhost'
});

module.exports = sequelize;
