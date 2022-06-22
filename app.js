const express = require('express');

const sequelize = require('./util/database');
const Appointment = require('./models/appointment');
const ClientGuest = require('./models/client-guest');

const app = express();

app.use((req, res, next) => {
  console.log('handling http request...');
  next();
})

Appointment.belongsTo(ClientGuest);
ClientGuest.hasOne(Appointment);

app.listen(3000);
