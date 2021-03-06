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
    validate: {
      zeroOr30Min(value) {
        const date = new Date(value);
        if (!(date.getMilliseconds() === 0
            && date.getSeconds() === 0
            && (date.getMinutes() === 0 || date.getMinutes() === 30))) {
          throw new Error('startDateTime\'s time must have format hh:00:00 or hh:30:00');
        }
      },
      isUnique(value) {
        return Appointment.findOne({ where: { startDateTime: new Date(value) } })
          .then((appointment) => {
            if (appointment) {
              throw new Error('this startDateTime is already taken');
            }
          });
      },
      hasPassed(value) {
        if (new Date(value) < new Date()) {
          throw new Error('cannot create an appointment for a timeslot that has passed');
        }
      },
    },
  },
  endDateTime: {
    type: Sequelize.DATE,
    allowNull: false,
    validate: {
      zeroOr30Min(value) {
        const date = new Date(value);
        if (!(date.getMilliseconds() === 0
            && date.getSeconds() === 0
            && (date.getMinutes() === 0 || date.getMinutes() === 30))) {
          throw new Error('endDateTime\'s time must have format hh:00:00 or hh:30:00');
        }
      },
      isUnique(value) {
        return Appointment.findOne({ where: { endDateTime: new Date(value) } })
          .then((appointment) => {
            if (appointment) {
              throw new Error('this endDateTime is already taken');
            }
          });
      },
    },
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
