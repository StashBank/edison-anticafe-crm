const Sequelize = require('sequelize');
const settings = require('../setttings');
const connectionStrings = settings.connectionStrings;
const sequelize = new Sequelize(connectionStrings.sequelize, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    }
});
const DataTypes = Sequelize;
const lookups = require('./lookups');
const ExpenseType = lookups.ExpenseType;
const alterTableOnSync = settings.sequelize.alterTableOnSync;

const Expense = sequelize.define('Expense', {
	id: { type: Sequelize.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
	date: Sequelize.DATE,
	amount: Sequelize.DECIMAL
});


Expense.belongsTo(ExpenseType, { as: 'type' });

Expense.sync({ alter: alterTableOnSync })
    .then(() => console.log('sequelize Expense has been synchronized'))
    .catch((err) => { console.log('sequelize Expense has not been synchronized'); throw err });

module.exports = Expense;