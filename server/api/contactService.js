const express = require('express');
const app = express();
const Sequelize = require('sequelize');
const connectionStrings = require('../setttings').connectionStrings;
const sequelize = new Sequelize(connectionStrings.sequelize);
const Contact = require('../models/contact');
const lookups = require('../models/lookups');
const Age = lookups.Age;
const Target = lookups.Target;
const Product = lookups.Product;

const getModelObject = (body, model) => {
    const obj = {};
    for(const attribute in body) {
        const column = model.attributes[attribute] || model.attributes[`${attribute}Id`];
        const columnPath = column && column.fieldName;
        if (columnPath && model.tableAttributes.hasOwnProperty(columnPath)) {
            obj[columnPath] = body[attribute];
        }
    }
    return obj;
}

const errorHandler = (res, err) => {
    console.dir(err);
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: process.env.NODE_ENV === 'production' ? {} : err,
        success: false
    });
}

const contactInclude = [
    {
        model: Age,
        as: 'age',
        attributes: ['id', 'name']
    },
    {
        model: Product,
        as: 'product',
        attributes: ['id', 'name']
    },
    {
        model: Target,
        as: 'target',
        attributes: ['id', 'name']
    }
];

app.get('/schema', (req, res) => {
    res.send({ 
        tableAttributes: Contact.tableAttributes,
        attributes: Contact.attributes
    });
});

app.get('/', (req, res) => {
    Contact.findAll( {include: contactInclude} )
        .then((contacts) => res.send({ success: true, data: contacts }))
        .catch((err) => { errorHandler(res, err) });
});

app.get('/:id', (req, res) => {
    const id = req.params.id;
    Contact.findById(id, { include: contactInclude })
        .then((contact) => {
            if (contact) {
                return res.send({ success: true, data: contact });
            }
            res.status(404).send({success: false, message: 'Contact Not Found'});
        })
        .catch((err) => { errorHandler(res, err) });
});

app.post('/', (req, res) => {
    const body = req.body;
    if (!body || body === {}) {
        res.status(500).send({ error: "contact data is required", success: false })
    }
    Contact.create(getModelObject(body, Contact))
        .then((contact) => res.send({success: true, data: contact}))
        .catch((err) => { errorHandler(res, err)});
});

app.put('/:id', (req, res) => {
    const body = req.body;
    const id = req.params.id;
    if (!body || body === {}) {
        res.status(500).send({ error: "contact data is required", success: false })
    }
    Contact.findById(id)
        .then((contact) => {
            if (!contact) {
                return res.status(404).send({ success: false, message: 'Contact Not Found' });
            }
            const obj = getModelObject(body, Contact);
            contact.update(obj)
                .then((contact) => res.send({ success: true, data: contact }))
                .catch((err) => { errorHandler(res, err) });
        })
        .catch((err) => { errorHandler(res, err) });
});

app.delete('/:id', (req, res) => {
    const id = req.params.id;
    Contact.findById(id)
        .then((contact) => {
            if (!contact) {
                return res.status(404).send({ success: false, message: 'Contact Not Found' });
            }
            contact.destroy()
                .then(() => res.send({ success: true}))
                .catch((err) => { errorHandler(res, err) });
        })
        .catch((err) => { errorHandler(res, err) });
});

module.exports = app;