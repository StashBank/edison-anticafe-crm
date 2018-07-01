const express = require('express');
const app = express();
const settings = require('../setttings');

const LookupModels = require('../models/lookups');

const LOOKUPS = settings.lookups;

const errorHandler = (res, err) => {
    console.dir(err);
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: process.env.NODE_ENV === 'production' ? {} : err,
        success: false
    });
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

const getInclude = (lookup) => {
    const include = lookup && lookup.include;
    if (include) {
        const res = [];
        include.forEach((i) => {
            const model = LookupModels[i.modelName];
            if (model) {
                i.model = model;
                res.push(i);
            }
        });

        return res;
    }
}

app.get('/', (req, res) => {
    res.send(LOOKUPS.filter(l => !l.notEditOnClientSide));
});

app.get('/lookupData/:lookupName', (req, res) => {
    const lookupName = req.params.lookupName;
    const lookup = LOOKUPS.find(l => l.name === lookupName);
    if (lookup) {
        let Model = LookupModels[lookupName]; 
        const include = getInclude(lookup);
        Model.findAll({ include: include})
            .then(
                data => res.send({ data: data, success: true })
            )
            .catch(
                err => { errorHandler(res, err) }
            );
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
        let Model = LookupModels[lookupName];
        const include = getInclude(lookup);
        Model.findById(id, { include: include })
            .then(
                data => res.send({ data: data, success: true })
            )
            .catch(
                err => { errorHandler(res, err) }
            );
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
        let Model = LookupModels[lookupName];
        Model.create(getModelObject(body, Model))
            .then(
                data => res.send({ data: data, success: true })
            )
            .catch(
                err => { errorHandler(res, err) }
            );
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
        let Model = LookupModels[lookupName];
        Model.findById(id)
            .then(item => {
                if (!item) {
                    return res.status(404).send({ success: false, message: 'Lookup item Not Found' });
                }
                item.update(getModelObject(body, Model))
                    .then(
                        data => res.send({ data: data, success: true })
                    )
                    .catch(
                        err => { errorHandler(res, err) }
                    );
            })
            .catch((err) => { errorHandler(res, err) });
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
        let Model = LookupModels[lookupName];
        Model.findById(id)
            .then(item => {
                if (!item) {
                    return res.status(404).send({ success: false, message: 'Lookup item Not Found' });
                }
                item.destroy()
                    .then(() => res.send({ success: true }))
                    .catch(
                        err => { errorHandler(res, err) }
                    );
            })
            .catch(
                err => { errorHandler(res, err) }
            );
    } else {
        res.status(400).send({
            error: `lookup with name ${lookupName} not found`,
            success: false
        });
    }
});

module.exports = app;