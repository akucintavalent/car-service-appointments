const express = require('express');

const sequelize = require('./util/database');
const Appointment = require('./models/appointment');
const ClientGuest = require('./models/client-guest');

const app = express();

const appointmentRoutes = require('./routes/appointment');

app.use('/api/appointments', appointmentRoutes.routes);

Appointment.belongsTo(ClientGuest);
ClientGuest.hasOne(Appointment);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
