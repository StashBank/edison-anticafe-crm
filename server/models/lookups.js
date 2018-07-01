const settings = require('../setttings');
const db = require('../db/sequelize');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const LOOKUPS = settings.lookups;
const alterTableOnSync = settings.sequelize.alterTableOnSync;

const lookupModels = {};
for(const lookup of LOOKUPS) {
    attributes = Object.assign({
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: false }
    }, lookup.attributes);
    lookupModels[lookup.name] = sequelize.define(lookup.name, attributes);
    // lookupModels[lookup.name].sync({ alter: true });
}

const Tariff = lookupModels.Tariff;
const TariffType = lookupModels.TariffType;
const Product = lookupModels.Product;

Tariff.hasMany(Tariff, { as: 'children', foreignKey: 'parentId' });
Tariff.belongsTo(Tariff, { as: 'parent' });
Tariff.belongsTo(TariffType, { as: 'type' });
Product.belongsTo(Tariff, { as: 'tariff' });

Tariff.sync({ alter: true });
Product.sync({ alter: true });

sequelize.sync({ alter: alterTableOnSync })
   .then(() => console.log('sequelize Lookups has been synchronized'))
   .catch((err) => { console.log('sequelize Lookups has not been synchronized'); throw err });

const tariffTypesToExists = [
    { name: 'Одноразово', code: 'once' },
    { name: 'День', code: 'day' },
    { name: 'Ручне введеня', code: 'manually' },
    { name: 'Погодинно', code: 'hour' },
]
tariffTypesToExists.forEach(async type => {
    const dbType = await TariffType.findOne({where: {code: type.code }});
    if (!dbType) {
        TariffType.create(type); 
    }
});

module.exports = lookupModels;