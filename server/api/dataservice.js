const express = require('express');
const app = express();

//const connectionStrings = require('../setttings').connectionStrings;
const connectionStrings = {
    mongoDB: 'mongodb://admin:0_admin_1@ds159024.mlab.com:59024/edison-anticafe-crm-dev'
};

const mongoose = require('mongoose');
mongoose.connect(connectionStrings.mongoDB, { useMongoClient: true });
mongoose.Promise = global.Promise;

const Contact = require('../models/contactModel');

app.get('/contactCollection', (req, res) => {
    Contact.find()
        .then(data => res.send({data: data, success: true}))
        .catch(err => res.status(404).send({ error: err, success: false}));
});

app.get('/contact/:id', (req, res) => {
    const id = req.params.id;
    Contact.findById(id)
        .then(data => res.send({ data: data, success: true }))
        .catch(err => res.status(404).send({ error: err, success: false }));
});

app.post('/contact', (req, res) => {
    const body = req.body;
    if (!body || body === {}) {
        res.status(404).send({ error: "contact data is required", success: false })
    }
    let contact = new Contact(body);
    contact.save()
        .then(contact => res.send({ contact:contact, success: true}))
        .catch(err => res.status(404).send({ error: err, success: false }));
});

app.put('/contact/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    if (!body || body === {}) {
        res.status(404).send({ error: "contact data is required", success: false })
    }
    Contact.findByIdAndUpdate(id, body)
        .then(() => res.send({ success: true }))
        .catch(err => res.status(404).send({ error: err, success: false }));
});

app.delete('/contact/:id', (req, res) => {
    const id = req.params.id;
    Contact.findByIdAndRemove(id)
        .then((data) => res.send({ success: data != null }))
        .catch(err => res.status(404).send({ error: err, success: false }));
});

module.exports = app;