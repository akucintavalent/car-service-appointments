const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ClientGuest = sequelize.define('clientGuest', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      is: /^[a-zA-Z]+$/i
    },
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      is: /^[a-zA-Z]+$/i
    },
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      is: /^[\+]?\d{6,12}$/g
    },
  },
});

module.exports = ClientGuest;
