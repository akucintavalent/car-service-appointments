const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Appointment = sequelize.define('appointment', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  startDateTime: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  endDateTime: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  reason: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      len: [10, 10000],
    },
  },
});

module.exports = Appointment;
