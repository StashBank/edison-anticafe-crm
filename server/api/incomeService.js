const express = require('express');
const app = express();
const db = require('../db/sequelize');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const Income = require('../models/income').Income;
const Order = require('../models/order').Order;
const lookups = require('../models/lookups');
const IncomeType = lookups.IncomeType;

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

const incomeInclude = [
	{
		model: IncomeType,
		as: 'type',
		attributes: ['id', 'name']
	},
	{
		model: Order,
		as: 'order',
		attributes: ['id', 'number']
	}
];

const parseDate = (src) => src ? new Date(Date.parse(src)) : null;

app.get('/schema', (req, res) => {
	res.send({
		tableAttributes: Income.tableAttributes,
		attributes: Income.attributes
	});
});

app.get('/', async (req, res) => {
	try {
		const incomes = await Income.findAll({ include: incomeInclude })
		res.send({ success: true, data: incomes })
	} catch(err) {
		errorHandler(res, err)
	};
});

app.get('/:id', async (req, res) => {
	const id = req.params.id;
	try {
		const income = await Income.findById(id, { include: incomeInclude });
		if (!income) {
			return res.status(404).send({ success: false, message: 'Income Not Found' });
		}
		res.send({ success: true, data: income });
	} catch (err) {
		errorHandler(res, err)
	}
});

app.post('/', (req, res) => {
	const body = req.body;
	if (!body || body === {}) {
		res.status(500).send({ error: "income data is required", success: false })
	}
	Income.create(getModelObject(body, Income))
		.then((income) => res.send({ success: true, data: income }))
		.catch((err) => { errorHandler(res, err) });
});

app.put('/:id', async (req, res) => {
	const body = req.body;
	const id = req.params.id;
	if (!body || body === {}) {
		res.status(500).send({ error: "Income data is required", success: false })
	}
	try {
		let income = await Income.findById(id);
		await income.update(getModelObject(body, Income));
		res.send({ success: true, data: income });
	} catch (err) {
		errorHandler(res, err);
	}
});

app.delete('/:id', async (req, res) => {
	const id = req.params.id;
	try {
		let income = await Income.findById(id)
		if (!income) {
			return res.status(404).send({ success: false, message: 'Income  Not Found' });
		}
		await income.destroy()
		res.send({ success: true });
	} catch (err) {
		errorHandler(res, err)
	}
});

module.exports = app;