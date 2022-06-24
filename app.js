const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const Appointment = require('./models/appointment');
const ClientGuest = require('./models/client-guest');

const app = express();

require('dotenv').config();

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

module.exports = new Promise((resolve, reject) => {
  sequelize
    .sync({ force: true })
    // .sync()
    .then(() => {
      const PORT = process.env.NODE_DOCKER_PORT || 8080;
      const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
        resolve(server);
      });
      resolve(server);
    })
    .catch((err) => reject(err));
});
