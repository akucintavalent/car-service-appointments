const ClientGuest = require('../models/client-guest');

exports.postAppointment = (req, res, next) => {
  ClientGuest
    .create({
      firstName: 'Bohdan',
      lastName: 'Shcherbak',
      phoneNumber: '+489395839204',
    })
    .then((client) => client.createAppointment({
      startDateTime: '2022-10-10 13:13:13',
      endDateTime: '2022-10-10 13:13:13',
      reason: 'Something went wrong. It seems to me like blah blah.',
    }))
    .then((appointment) => console.log(appointment))
    .catch((err) => console.log(err));
  next();
};
