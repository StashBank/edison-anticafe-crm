const settings = require('../setttings');
const db = require('../db/sequelize');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
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

// Order.destroy({ where: { productId: 'eb0ba58e-1432-4294-94f9-8ed42f075a08'}});

// Order.destroy({ where: {id:{[Sequelize.Op.ne]: null}}});

module.exports = { Order };