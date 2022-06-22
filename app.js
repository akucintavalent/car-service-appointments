const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('handling http request...');
  next();
})

app.listen(3000);
