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

sequelize
  .sync({ force: true })
  // .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => console.log(err));
