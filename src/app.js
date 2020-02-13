const express = require('express');

const app = express();

const userControllers = require('./controllers/users');

app.use(express.json());

// User Routes

app.post('/users', userControllers.create);

module.exports = app;
