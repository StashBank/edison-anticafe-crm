const Sequelize = require('sequelize');
const settings = require('../setttings');
const connectionStrings = settings.connectionStrings;
const sequelize = new Sequelize(connectionStrings.sequelize);
const DataTypes = Sequelize;
const lookups = require('./lookups');
const Age = lookups.Age;
const Target = lookups.Target;
const Product = lookups.Product;
const alterTableOnSync = settings.sequelize.alterTableOnSync;

const Contact = sequelize.define('Contact', {
    id: { type: Sequelize.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    contactId: { type: Sequelize.INTEGER, autoIncrement: true },
    firstName: { type: Sequelize.STRING, allowNull: false },
    lastName: Sequelize.STRING,
    mobilePhone: Sequelize.STRING,
    email: Sequelize.STRING,
    birthDate: Sequelize.DATE,
    notes: Sequelize.TEXT,
});

Contact.belongsTo(Age, { as: 'age' });
Contact.belongsTo(Target, { as: 'target' });
Contact.belongsTo(Product, { as: 'product' });

/* sequelize.sync({ alter: alterTableOnSync})
    .then(() => console.log('sequelize Contact has been synchronized'))
    .catch((err) => { console.log('sequelize Contact has not been synchronized'); throw err});
*/
module.exports = Contact;