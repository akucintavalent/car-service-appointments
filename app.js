const express = require('express');

const sequelize = require('./util/database');
const Appointment = require('./models/appointment');
const ClientGuest = require('./models/client-guest');

const app = express();

app.use((req, res, next) => {
  console.log('handling http request...');
  ClientGuest
    .create({
      firstName: 'Bohdan',
      lastName: 'Shcherbak',
      phoneNumber: '+489395839204'
    })
    .then(client => {
      return client.createAppointment({
        startDateTime: new Date(),
        endDateTime: new Date(),
        reason: 'Something went wrong. It seems to me like blah blah.',
      })
    })
    .then(appointment => console.log(appointment))
    .catch(err => console.log(err));
  next();
})

Appointment.belongsTo(ClientGuest);
ClientGuest.hasOne(Appointment);

sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => console.log(err));
