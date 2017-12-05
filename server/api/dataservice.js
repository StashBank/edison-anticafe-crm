const express = require('express');
const app = express();

const connectionStrings = require('../setttings').connectionStrings;

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const dbUtils = require('../db/utils');

const Contact = require('../models/contactModel');
const lookupModels = require('../models/lookupModel');
const Age = lookupModels.getLookupModel('age');
const Product = lookupModels.getLookupModel('product');
const Target = lookupModels.getLookupModel('target');

const connect = function () {
    return new Promise((resolve, reject) => {
        const opts = { useMongoClient: true };
        mongoose.connect(connectionStrings.mongoDB, opts)
        .then(resolve)
        .catch(reject);
    });
};

const disconnect = () => {
    mongoose.disconnect()
    .catch(err => console.log(`error while disconnecting MongoDB: ${err}`));
};

app.get('/contactCollection', (req, res) => {
    connect()
    .then(() => {
        Contact.find()
        .populate('age')
        .populate('product')
        .populate('target')
        .then(data => res.send({data: data, success: true}))
        .then(disconnect)
    })
    .catch(err => {
        res.status(500).send({ error: err.message, success: false });
        disconnect();
    });
});

app.get('/contact/:id', (req, res) => {
    const id = req.params.id;
    connect()
    .then(() => {
        Contact.findById(id)
        .populate('age')
        .populate('product')
        .populate('target')
        .then(data => res.send({ data: data, success: true }))
        .then(disconnect)
    })
    .catch(err => {
        res.status(500).send({ error: err.message, success: false });
        disconnect();
    });
});

app.post('/contact', (req, res) => {
    const body = req.body;
    if (!body || body === {}) {
        res.status(500).send({ error: "contact data is required", success: false })
    }
    let contactId = 0;
    dbUtils.getNextSequence('contactId')
    .then((contactId) => {
        let contact = new Contact(body);
        contact.contactId = contactId;
        contact.save()
        .then(contact => res.send({ contact: contact, success: true }))
        .catch(err => {
            res.status(500).send({ error: err.message, success: false });
        });
    })
    .catch(err => {
        res.status(500).send({ error: err.message, success: false });
    });
});

app.put('/contact/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    if (!body || body === {}) {
        res.status(500).send({ error: "contact data is required", success: false })
    }
    connect()
    .then(() => {
        Contact.findByIdAndUpdate(id, body)
        .then(() => res.send({ success: true }))
        .then(disconnect)
    })
    .catch(err => {
        res.status(500).send({ error: err.message, success: false });
        disconnect();
    });
});

app.delete('/contact/:id', (req, res) => {
    const id = req.params.id;
    connect()
    .then(() => {
    Contact.findByIdAndRemove(id)
        .then((data) => res.send({ success: data != null }))
    })
    .catch(err => {
        res.status(500).send({ error: err.message, success: false });
        disconnect();
    });
});

module.exports = app;