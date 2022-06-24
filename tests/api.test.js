require('dotenv').config();
const axios = require('axios');
const { describe } = require('yargs');
const Appointment = require('../models/appointment');
const ClientGuest = require('../models/client-guest');

process.env.TEST_DB_NAME = 'car-service-test';
process.env.NODE_DOCKER_PORT = 3333;

jest.setTimeout(15000);

const serverPromise = require('../app');

// Wait until the app starts
beforeAll((done) => {
  Appointment.destroy({ where: {} });
  ClientGuest.destroy({ where: {} });
  setTimeout(() => {
    done();
  }, 3000);
});

afterAll((done) => {
  serverPromise.then((server) => {
    server.close();
    done();
  }).catch((err) => done(err));
});

describe('Find free timeslots', () => {
  test('there are 48 free timeslots', async () => {
    const jsonPromise = axios.get(`http://localhost:${process.env.NODE_DOCKER_PORT}/api/appointments/find-free-timeslots?day=2022-01-01`).then((result) => result.data);
    expect((await jsonPromise).freeSlots.length).toBe(48);
  });

  test('there are no taken timeslots', async () => {
    const jsonPromise = axios.get(`http://localhost:${process.env.NODE_DOCKER_PORT}/api/appointments/find-free-timeslots?day=2022-01-01`).then((result) => result.data);
    expect((await jsonPromise).takenSlots.length).toBe(0);
  });

  test('timeslots are different', async () => {
    const jsonPromise = axios.get(`http://localhost:${process.env.NODE_DOCKER_PORT}/api/appointments/find-free-timeslots?day=2022-01-01`).then((result) => result.data);
    const startDateTimesPromise = jsonPromise.then(
      (json) => json.freeSlots.map((timeslot) => timeslot.startDateTime),
    );
    expect(new Set(await startDateTimesPromise).size).toBe(48);
  });

  test('all timeslots\' times are of format HH:00:00 or HH:30:00', async () => {
    const jsonPromise = axios.get(`http://localhost:${process.env.NODE_DOCKER_PORT}/api/appointments/find-free-timeslots?day=2022-01-01`).then((result) => result.data);
    const startDateTimesPromise = jsonPromise.then(
      (json) => json.freeSlots.map((timeslot) => timeslot.startDateTime),
    );
    const emptySet = (await startDateTimesPromise).filter(
      (startDateTime) => new Date(startDateTime).getTime() % (30 * 60 * 1000),
    );
    expect(emptySet.length).toBe(0);
  });

  test('all timeslots belong to the same day', async () => {
    const jsonPromise = axios.get(`http://localhost:${process.env.NODE_DOCKER_PORT}/api/appointments/find-free-timeslots?day=2022-01-01`).then((result) => result.data);
    const startDateTimesPromise = jsonPromise.then(
      (json) => json.freeSlots.map((timeslot) => timeslot.startDateTime),
    );
    const fullSet = (await startDateTimesPromise).filter((startDateTime) => {
      const date = new Date(startDateTime);
      return date.getUTCMonth() + 1 === 1 && date.getUTCDate() === 1;
    });
    expect(fullSet.length).toBe(48);
  });

  test('all timeslots last for 30 min', async () => {
    const jsonPromise = axios.get(`http://localhost:${process.env.NODE_DOCKER_PORT}/api/appointments/find-free-timeslots?day=2022-01-01`).then((result) => result.data);
    const allSlots = (await jsonPromise).freeSlots.filter(
      (timeslot) => new Date(timeslot.endDateTime).getTime()
        - new Date(timeslot.startDateTime).getTime() === 30 * 60 * 1000,
    );
    expect(allSlots.length).toBe(48);
  });
});
