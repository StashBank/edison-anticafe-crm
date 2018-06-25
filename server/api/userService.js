const express = require('express');
const app = express();
const User = require('../models/user').User;

app.get('/currentUser', (req, res) => {
  const { id, login } = req.user;
  res.send({ id, login });
});

module.exports = app;