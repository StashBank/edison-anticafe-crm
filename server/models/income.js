const settings = require('../setttings');
const db = require('../db/sequelize');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const DataTypes = Sequelize;
const lookups = require('./lookups');
const IncomeType = lookups.IncomeType;
const Order = require('./order').Order;
const alterTableOnSync = settings.sequelize.alterTableOnSync;

const Income = sequelize.define('Income', {
	id: { type: Sequelize.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
	date: Sequelize.DATE,
	amount: Sequelize.DECIMAL
});


Income.belongsTo(IncomeType, { as: 'type' });
Income.belongsTo(Order, { as: 'order' });

// Income.sync({ alter: alterTableOnSync })
Income.sync({ alter: true })
    .then(() => console.log('sequelize Income has been synchronized'))
    .catch((err) => { console.log('sequelize Income has not been synchronized'); throw err });

module.exports = { Income };