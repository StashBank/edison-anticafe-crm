const express = require('express');
const app = express();

const connectionStrings = require('../setttings').connectionStrings;

const mongoose = require('mongoose');
mongoose.connect(connectionStrings.mongoDB, { useMongoClient: true });
mongoose.Promise = global.Promise;

const dbUtils = require('../db/utils');

const Contact = require('../models/contactModel');
const lookupModels = require('../models/lookupModel');
const Age = lookupModels.getLookupModel('age');
const Product = lookupModels.getLookupModel('product');
const Target = lookupModels.getLookupModel('target');

app.get('/contactCollection', (req, res) => {
    Contact.find()
        .populate('age')
        .populate('product')
        .populate('target')
        .then(data => res.send({data: data, success: true}))
        .catch(err => res.status(404).send({ error: err, success: false}));
});

app.get('/contact/:id', (req, res) => {
    const id = req.params.id;
    Contact.findById(id)
        .populate('age')
        .populate('product')
        .populate('target')
        .then(data => res.send({ data: data, success: true }))
        .catch(err => res.status(404).send({ error: err, success: false }));
});

app.post('/contact', (req, res) => {
    const body = req.body;
    if (!body || body === {}) {
        res.status(404).send({ error: "contact data is required", success: false })
    }
    dbUtils.getNextSequence('contactId')
        .then((contactId) => {
            let contact = new Contact(body);
            contact.contactId = contactId;
            contact.save()
                .then(contact => res.send({ contact: contact, success: true }))
                .catch(err => res.status(404).send({ error: err, success: false }));
        })
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