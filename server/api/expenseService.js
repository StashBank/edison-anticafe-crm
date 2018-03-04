const express = require('express');
const app = express();
const Sequelize = require('sequelize');
const connectionStrings = require('../setttings').connectionStrings;
const sequelize = new Sequelize(connectionStrings.sequelize, {
	dialect: 'postgres',
	dialectOptions: {
		ssl: true
	}
});
const Expense = require('../models/expense');
const lookups = require('../models/lookups');
const ExpenseType = lookups.ExpenseType;

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

const expenseInclude = [
	{
		model: ExpenseType,
		as: 'type',
		attributes: ['id', 'name']
	}
];

const parseDate = (src) => src ? new Date(Date.parse(src)) : null;

app.get('/schema', (req, res) => {
	res.send({
		tableAttributes: Expense.tableAttributes,
		attributes: Expense.attributes
	});
});

app.get('/', (req, res) => {
	Expense.findAll({ include: expenseInclude })
		.then((expenses) => res.send({ success: true, data: expenses }))
		.catch((err) => { errorHandler(res, err) });
});

app.get('/:id', async (req, res) => {
	const id = req.params.id;
	try {
		const expense = await Expense.findById(id, { include: expenseInclude });
		if (!expense) {
			return res.status(404).send({ success: false, message: 'Expense Not Found' });
		}
		res.send({ success: true, data: expense });
	} catch (err) {
		errorHandler(res, err)
	}
});

app.post('/', (req, res) => {
	const body = req.body;
	if (!body || body === {}) {
		res.status(500).send({ error: "expense data is required", success: false })
	}
	Expense.create(getModelObject(body, Expense))
		.then((expense) => res.send({ success: true, data: expense }))
		.catch((err) => { errorHandler(res, err) });
});

app.put('/:id', async (req, res) => {
	const body = req.body;
	const id = req.params.id;
	if (!body || body === {}) {
		res.status(500).send({ error: "Expense data is required", success: false })
	}
	try {
		let expense = await Expense.findById(id);
		await expense.update(getModelObject(body, Expense));
		res.send({ success: true, data: expense });
	} catch (err) {
		errorHandler(res, err);
	}
});

app.delete('/:id', async (req, res) => {
	const id = req.params.id;
	try {
		let expense = await Expense.findById(id)
		if (!expense) {
			return res.status(404).send({ success: false, message: 'Expense  Not Found' });
		}
		await expense.destroy()
		res.send({ success: true });
	} catch (err) {
		errorHandler(res, err)
	}
});

module.exports = app;