const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const Appointment = require('./models/appointment');
const ClientGuest = require('./models/client-guest');

const app = express();

const appointmentRoutes = require('./routes/appointment');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/api/appointments', appointmentRoutes.routes);

Appointment.belongsTo(ClientGuest);
ClientGuest.hasOne(Appointment);

sequelize
  .sync({ force: true })
  // .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
