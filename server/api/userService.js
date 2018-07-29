const express = require('express');
const app = express();
const User = require('../models/user').User;
const bcrypt = require('bcrypt');

const errorHandler = (res, err) => {
  console.dir(err);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
    success: false
  });
}

const validateLogin = login => {
  return login && login.length >= 4;
}

const validatePassword = password => {
  return password && password.length >= 4;
}

const getModelObject = (body, model) => {
  const obj = {};
  for (const attribute in body) {
    const column = model.attributes[attribute] || model.attributes[`${attribute}Id`];
    const columnPath = column && column.fieldName;
    if (columnPath && model.tableAttributes.hasOwnProperty(columnPath)) {
      obj[columnPath] = body[attribute];
    }
  }
  return obj;
}

app.get('/currentUser', (req, res) => {
  const { id, login, name, isAdmin } = req.user;
  userName = name || login;
  res.send({ id, name: userName, isAdmin });
});

app.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.send({ success: true, data: users });
  } catch (err) {
    errorHandler(res, err)
  }
});

app.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if(!user) {
      return res.status(404).send({ success: false, message: 'User Not Found' });
    }
    res.send({ success: true, data: user });
  } catch (err) {
    errorHandler(res, err)
  }
});

app.get('/byLogin/:login', async (req, res) => {
  const login = req.params.login;
  try {
    const user = await User.findOne({ login });
    if(!user) {
      return res.status(404).send({ success: false, message: 'User Not Found' });
    }
    res.send({ success: true, data: user });
  } catch (err) {
    errorHandler(res, err)
  }
});

app.post('/', async (req, res) => {
  const body = req.body;
  if (!body || body === {}) {
    res.status(400).send({ error: "User data is required", success: false });
  }
  try {
    if (!validateLogin(body.login)) {
      res.status(400).send({ error: "Login is not valid", success: false });
      return;
    }
    if (!validatePassword(body.password)) {
      res.status(400).send({ error: "Password is not valid", success: false });
      return;
    }
    const password = bcrypt.hashSync(body.password, 12);
    if (!req.user.isAdmin) {
      body.isAdmin = false;
    }
    const user = await User.create(getModelObject(Object.assign(body, { password, active: true }), User));
    res.send({ success: true, data: user });
  } catch(err) {
    errorHandler(res, err)
  };
});

app.put('/:id', async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  if (!body || body === {}) {
    res.status(400).send({ error: "User data is required", success: false })
  }
  try {
    let user = await User.findById(id);
    user = await user.update({
      name: body.hasOwnProperty('name') ? body.name : user.name,
      email: body.hasOwnProperty('email') ? body.email : user.email,
      phone: body.hasOwnProperty('email') ? body.phone : user.phone,
      isAdmin: body.hasOwnProperty('email') ? body.isAdmin : user.isAdmin
    });
    res.send({ success: true, data: user });
  } catch (err) {
    errorHandler(res, err);
  }
});

app.put('/:id/changePassword', async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  if (!body || body === {}) {
    res.status(400).send({ error: "User data is required", success: false });
    return;
  } else if (!validatePassword(body.oldPassword) || !validatePassword(body.newPassword)) {
    res.status(400).send({ error: "Least one Password is not valid", success: false });
    return;
  }
  try {
    let user = await User.findById(id);
    if (!bcrypt.compareSync(password, user.password)) {
      const newPassword = bcrypt.hashSync(body.newPassword, user.salt || 12);
      user = await user.update({ password: newPassword });
      res.send({ success: true, data: user });
    } else {
      res.status(400).send({ error: "Passwords are not equals", success: false });
    }
  } catch (err) {
    errorHandler(res, err);
  } 
});

module.exports = app;