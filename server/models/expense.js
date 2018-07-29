const settings = require('../setttings');
const connectionStrings = settings.connectionStrings;
const db = require('../db/sequelize');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
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

// Expense.sync({ alter: alterTableOnSync })
//     .then(() => console.log('sequelize Expense has been synchronized'))
//     .catch((err) => { console.log('sequelize Expense has not been synchronized'); throw err });

// Expense.destroy({ where: {id:{[Sequelize.Op.ne]: null}}});

module.exports = Expense;