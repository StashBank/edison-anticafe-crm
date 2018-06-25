const express = require('express');
const app = express();
const Contact = require('../models/contact');
const OrderModels = require('../models/order');
const Order = OrderModels.Order;
const lookups = require('../models/lookups');
const OrderStatus = lookups.OrderStatus;
const Product = lookups.Product;
let OrderStatuses = null;
const Utils = require('../utils/order.utils');

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

const orderInclude = [
    {
        model: Contact,
        as: 'contact',
        attributes: ['id', 'firstName', 'lastName']
    },
    {
        model: OrderStatus,
        as: 'status',
        attributes: ['id', 'name', 'code', 'isFinal']
    },
    {
        model: Product,
        as: 'product',
        attributes: ['id', 'name']
    }
];

const getOrderStatuses = async () => {
    if (!OrderStatuses) {
        OrderStatuses = await OrderStatus
            .findAll()
            .map(i => i.dataValues);
    }
    return OrderStatuses;
}

const parseDate = (src) => src ? new Date(Date.parse(src)) : null;

app.get('/schema', (req, res) => {
    res.send({
        tableAttributes: Order.tableAttributes,
        attributes: Order.attributes
    });
});

app.get('/', (req, res) => {
    Order.findAll({ include: orderInclude })
        .then((orders) => res.send({ success: true, data: orders }))
        .catch((err) => { errorHandler(res, err) });
});

app.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const order = await Order.findById(id, { include: orderInclude });
        if (!order) {
            return res.status(404).send({ success: false, message: 'Order Not Found' });
        }
        res.send({ success: true, data: order });
    } catch(err) {
        errorHandler(res, err)
    }
});

app.get('/contact/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const include = orderInclude.map(i => {
            const res = Object.assign({}, i);
            if (res.as === 'status') {
                res.where = { isFinal: false }
            }
            return res;
        });
        const order = await Order.findOne({
            where: {
                contactId: id,
            },
            include: include 
        });
        if (!order) {
            return res.send({ success: true, data: null });
        }
        res.send({ success: true, data: order });
    } catch (err) {
        errorHandler(res, err)
    }
});

app.post('/', (req, res) => {
    const body = req.body;
    if (!body || body === {}) {
        res.status(500).send({ error: "order data is required", success: false })
    }
    Order.create(getModelObject(body, Order))
        .then((order) => res.send({ success: true, data: order }))
        .catch((err) => { errorHandler(res, err) });
});

app.put('/:id', async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    if (!body || body === {}) {
        res.status(500).send({ error: "order data is required", success: false })
    }
    try {
        let order = await Order.findById(id);
        await order.update(getModelObject(body, Order));
        res.send({ success: true, data: order });
    } catch (err) {
        errorHandler(res, err);
    }
});

app.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let order = await Order.findById(id)
        if (!order) {
            return res.status(404).send({ success: false, message: 'Order  Not Found' });
        }
        await order.destroy()
        res.send({ success: true });
    } catch (err) {
        errorHandler(res, err) 
    }
});

app.post('/perform', async (req, res) => {
    const id = req.body.orderId;
    if (!id) {
        res.status(500).send({ error: "orderId is required", success: false })
    }
    try {
        const order = await Order.findById(id);
        const statuses = await getOrderStatuses();
        const statusId = statuses.find(i => i.code === 'InProgress').id;
        const startDate = new Date();
        const timeline = {
            index: 0,
            timelines: [{
                startDate: startDate,
                endDate: null
            }]
        }
        const newValues = { statusId, startDate, timeline }
        await order.update(getModelObject(newValues, Order))
        res.send({ success: true, data: newValues });
    } catch (err) {
        errorHandler(res, err);
    }
});

app.post('/postpone', async (req, res) => {
    const id = req.body.orderId;
    if (!id) {
        res.status(500).send({ error: "orderId is required", success: false })
    }
    try {
        const order = await Order.findById(id);
        const statuses = await getOrderStatuses();
        const statusId = statuses.find(i => i.code === 'Postponed').id;
        const timeline = order.timeline;
        timeline.timelines[timeline.index].endDate = new Date();
        const newValues = { statusId, timeline }
        await order.update(getModelObject(newValues, Order))
        res.send({ success: true, data: newValues });
    } catch (err) {
        errorHandler(res, err);
    }
});

app.post('/continue', async (req, res) => {
    const id = req.body.orderId;
    if (!id) {
        res.status(500).send({ error: "orderId is required", success: false })
    }
    try {
        const order = await Order.findById(id);
        const statuses = await getOrderStatuses();
        const statusId = statuses.find(i => i.code === 'InProgress').id;
        const startDate = new Date();
        const timeline = order.timeline;
        timeline.timelines.push({
            startDate: startDate,
            endDate: null
        });
        timeline.index++;
        const newValues = { statusId, timeline }
        await order.update(getModelObject(newValues, Order))
        res.send({ success: true, data: newValues });
    } catch (err) {
        errorHandler(res, err);
    }
});

app.post('/close', async (req, res) => {
    const id = req.body.orderId;
    if (!id) {
        res.status(500).send({ error: "orderId is required", success: false })
    }
    try {
        const order = await Order.findById(id, {
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'tariffId']
            }]
        });
        const statuses = await getOrderStatuses();
        const statusId = statuses.find(i => i.code === 'Closed').id;
        const endDate = new Date();
        const timeline = order.timeline;
        const timelines = timeline.timelines;
        timelines.forEach(i => {
            i.startDate = parseDate(i.startDate);
            i.endDate = parseDate(i.endDate);
        });
        timelines[timeline.index].endDate = endDate;
        order.timeline = timeline;
        const cost = await Utils.cost(order);
        await Utils.createOrderIncomes(order, cost);
        const newValues = { statusId, endDate, timeline, cost }
        await order.update(getModelObject(newValues, Order))
        res.send({ success: true, data: newValues });
    } catch (err) {
        errorHandler(res, err);
    }
});

app.post('/reject', async (req, res) => {
    const id = req.body.orderId;
    if (!id) {
        res.status(500).send({ error: "orderId is required", success: false })
    }
    try {
        const order = await Order.findById(id);
        const statuses = await getOrderStatuses();
        const statusId = statuses.find(i => i.code === 'Canceled').id;
        const endDate = new Date();
        const timeline = null;
        const newValues = { statusId, endDate, timeline }
        await order.update(getModelObject(newValues, Order))
        res.send({ success: true, data: newValues });
    } catch (err) {
        errorHandler(res, err);
    }
});

module.exports = app;