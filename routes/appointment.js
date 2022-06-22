const express = require('express');
const appointmentController = require('../controllers/appointment');

const router = express.Router();

router.post('/create-guest-appointment', appointmentController.postAppointment);

exports.routes = router;
