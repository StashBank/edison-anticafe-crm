const Sequelize = require('sequelize');
const settings = require('../setttings');
const connectionStrings = settings.connectionStrings;
const sequelize = new Sequelize(connectionStrings.sequelize, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    }
});
const LOOKUPS = settings.lookups;
const alterTableOnSync = settings.sequelize.alterTableOnSync;

const lookupModels = {};
for(const lookup of LOOKUPS) {
    attributes = Object.assign({
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: false }
    }, lookup.attributes);
    lookupModels[lookup.name] = sequelize.define(lookup.name, attributes);
    //lookupModels[lookup.name].sync({ alter: true });
}

const Tariff = lookupModels.Tariff;
const TariffType = lookupModels.TariffType;
const Product = lookupModels.Product;

Tariff.hasMany(Tariff, { as: 'children', foreignKey: 'parentId' });
Tariff.belongsTo(Tariff, { as: 'parent' });
Tariff.belongsTo(TariffType, { as: 'type' });
Product.belongsTo(Tariff, { as: 'tariff' });

// Tariff.sync({ alter: true });

sequelize.sync({ alter: alterTableOnSync })
   .then(() => console.log('sequelize Lookups has been synchronized'))
   .catch((err) => { console.log('sequelize Lookups has not been synchronized'); throw err });

module.exports = lookupModels;