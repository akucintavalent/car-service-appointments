const ClientGuest = require('../models/client-guest');

exports.postAppointment = (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    reason,
    appointmentTimeStart,
  } = req.body;
  ClientGuest
    .create({
      firstName,
      lastName,
      phoneNumber,
    })
    .then((client) => client.createAppointment({
      startDateTime: appointmentTimeStart,
      endDateTime: new Date(new Date(appointmentTimeStart).getTime() + 30 * 60 * 1000),
      reason,
    }).then((appointment) => {
      res.status(200).json({
        client,
        appointment,
      });
    }))
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};
