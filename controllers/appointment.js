const { Op } = require('sequelize');
const Appointment = require('../models/appointment');
const ClientGuest = require('../models/client-guest');

exports.postAppointment = (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    reason,
    appointmentTimeStart,
  } = req.body;
  let clientExisted = false;
  ClientGuest
    .findOne({ where: { firstName, lastName, phoneNumber } })
    .then((client) => {
      if (client) {
        clientExisted = true;
        return client;
      }
      return ClientGuest
        .create({
          firstName,
          lastName,
          phoneNumber,
        });
    })
    .then((client) => client.createAppointment({
      startDateTime: appointmentTimeStart,
      endDateTime: new Date(new Date(appointmentTimeStart).getTime() + 30 * 60 * 1000),
      reason,
    }).then((appointment) => {
      res.status(201).json({
        client,
        appointment,
      });
    }).catch((err) => {
      if (!clientExisted) {
        client.destroy();
      }
      res.status(422).json({
        message: err.message,
      });
    }))
    .catch((err) => {
      res.status(422).json({
        message: err.message,
      });
    });
};

exports.getFreeTimeslots = (req, res) => {
  const { day } = req.query;
  const currentDay = `${day}T00:00:00.000Z`;
  const nextDayDatetime = new Date(new Date(day) + 24 * 60 * 60 * 1000);
  const nextDay = `${nextDayDatetime.getFullYear()}-${nextDayDatetime.getMonth() + 1 >= 10 ? nextDayDatetime.getMonth() + 1 : `0${nextDayDatetime.getMonth() + 1}`}-${nextDayDatetime.getDate() + 1 >= 10 ? nextDayDatetime.getDate() + 1 : `0${nextDayDatetime.getDate() + 1}`}T00:00:00.000Z`;
  Appointment
    .findAll({
      where: {
        startDateTime: {
          [Op.and]: {
            [Op.gte]: currentDay,
            [Op.lt]: nextDay,
          },
        },
      },
    })
    .then((appointments) => {
      const takenSlots = appointments.map((appointment) => ({
        startDateTime: appointment.startDateTime,
        endDateTime: appointment.endDateTime,
      }));
      const takenStartDateTimes = new Set(takenSlots
        .map((appointment) => new Date(appointment.startDateTime).toISOString()));
      const allStartDateTimes = new Set();
      for (let i = 0; i < 48; i += 1) {
        allStartDateTimes.add(
          new Date(new Date(currentDay).getTime() + i * 30 * 60 * 1000).toISOString(),
        );
      }
      takenStartDateTimes.forEach((startDateTime) => allStartDateTimes.delete(startDateTime));
      const freeSlots = Array.from(allStartDateTimes)
        .map((startDateTime) => ({
          startDateTime,
          endDateTime: new Date(new Date(startDateTime).getTime() + 30 * 60 * 1000).toISOString(),
        }));
      res.status(200).json({
        takenSlots,
        freeSlots,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
