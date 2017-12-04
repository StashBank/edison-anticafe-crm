const express = require('express');
const app = express();

const settings = require('../setttings');
const connectionStrings = settings.connectionStrings;

const mongoose = require('mongoose');
mongoose.connect(connectionStrings.mongoDB, { useMongoClient: true });
mongoose.Promise = global.Promise;

const LookupModels = require('../models/lookupModel');

const LOOKUPS = settings.lookups;

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

app.get('/', (req, res) => {
    res.send(LOOKUPS);
});

app.get('/lookupData/:lookupName', (req, res) => {
    const lookupName = req.params.lookupName;
    const lookup = LOOKUPS.find(l => l.name === lookupName);
    if (lookup) {
        let Model = LookupModels.getLookupModel(lookupName);
        connect()
        .then(() => {
            Model.find()
            .then(data => res.send({ data: data, success: true }))
            .then(disconnect)
        })
        .catch(err => {
            res.status(500).send({ error: err, success: false });
            disconnect();
        });
    } else {
        res.status(400).send({
            error: `lookup with name ${lookupName} not found`,
            success: false 
        });
    }
});

app.get('/lookupItem/:lookupName/:id', (req, res) => {
    const lookupName = req.params.lookupName;
    const id = req.params.id;
    const lookup = LOOKUPS.find(l => l.name === lookupName);
    if (lookup) {
        let Model = LookupModels.getLookupModel(lookupName);
        connect()
        .then(() => {
            Model.findById(id)
            .then(data => res.send({ data: data, success: true }))
            .then(disconnect)
        })
        .catch(err => {
            res.status(500).send({ error: err, success: false });
            disconnect();
        });
    } else {
        res.status(400).send({
            error: `lookup with name ${lookupName} not found`,
            success: false
        });
    }
});

app.post('/lookupItem/:lookupName', (req, res) => {
    const body = req.body;
    const lookupName = req.params.lookupName;
    if (!body || body === {}) {
        res.status(400).send({ error: "lookup data is required", success: false })
    }
    const lookup = LOOKUPS.find(l => l.name === lookupName);
    if (lookup) {
        let Model = LookupModels.getLookupModel(lookupName);
        let item = new Model(body);
        connect()
        .then(() => {
            item.save()
            .then(item => res.send({ item: item, success: true }))
            .then(disconnect)
        })
        .catch(err => {
            res.status(500).send({ error: err, success: false });
            disconnect();
        });
    } else {
        res.status(400).send({
            error: `lookup with name ${lookupName} not found`,
            success: false
        });
    }
});

app.put('/lookupItem/:lookupName/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const lookupName = req.params.lookupName;
    if (!body || body === {}) {
        res.status(400).send({ error: "lookup data is required", success: false })
    }
    const lookup = LOOKUPS.find(l => l.name === lookupName);
    if (lookup) {
        let Model = LookupModels.getLookupModel(lookupName);
        connect()
        .then(() => {
        Model.findByIdAndUpdate(id, body)
            .then(() => res.send({ success: true }))
            .then(disconnect)
        })
        .catch(err => {
            res.status(500).send({ error: err, success: false });
            disconnect();
        });
    } else {
        res.status(400).send({
            error: `lookup with name ${lookupName} not found`,
            success: false
        });
    }
});

app.delete('/lookupItem/:lookupName/:id', (req, res) => {
    const id = req.params.id;
    const lookupName = req.params.lookupName;
    const lookup = LOOKUPS.find(l => l.name === lookupName);
    if (lookup) {
        let Model = LookupModels.getLookupModel(lookupName);
        connect()
        .then(() => {
        Model.findByIdAndRemove(id)
            .then((data) => res.send({ success: data != null }))
            .then(disconnect)
        })
        .catch(err => {
            res.status(500).send({ error: err, success: false });
            disconnect();
        });
    } else {
        res.status(400).send({
            error: `lookup with name ${lookupName} not found`,
            success: false
        });
    }
});

module.exports = app;