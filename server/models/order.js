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
const Contact = require('./contact');
const OrderStatus = lookups.OrderStatus;
const Product = lookups.Product;
const alterTableOnSync = settings.sequelize.alterTableOnSync;

const Order = sequelize.define('Order', {
    id: { type: Sequelize.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    number: { type: Sequelize.INTEGER, autoIncrement: true },
    contactName: { type: Sequelize.STRING },
    startDate: Sequelize.DATE,
    endDate: Sequelize.DATE,
    cost: Sequelize.DECIMAL,
    notes: Sequelize.TEXT,
    timeline: Sequelize.JSONB,
    products: Sequelize.JSONB
});

Order.belongsTo(Contact, { as: 'contact'});
Order.belongsTo(OrderStatus, { as: 'status' });
Order.belongsTo(Product, { as: 'product' });

// Order.sync({ alter:true });
//sequelize.sync({ alter: alterTableOnSync })
//    .then(() => console.log('sequelize Order has been synchronized'))
//    .catch((err) => { console.log('sequelize Order has not been synchronized'); throw err });

module.exports = { Order };