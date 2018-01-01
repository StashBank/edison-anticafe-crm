const Sequelize = require('sequelize');
const LOOKUPS = [
    {
        name: 'Age',
        caption: 'Вік'
    },
    {
        name: 'Target',
        caption: 'ЦА'
    },
    {
        name: 'Product',
        caption: 'Продукти',
        include: [
            {
                modelName: 'Tariff',
                as: 'tariff',
                attributes: ['id', 'name']
            }
        ]
    },
    {
        name: 'Tariff',
        caption: 'Тарифи',
        attributes: {
            cost: Sequelize.FLOAT,
            position: Sequelize.INTEGER
        },
        include: [
            {
                modelName: 'TariffType',
                as: 'type',
                attributes: ['id', 'name']
            },
            {
                modelName: 'Tariff',
                as: 'parent',
                attributes: ['id', 'name']
            },
            {
                modelName: 'Tariff',
                as: 'childrens',
                attributes: ['id', 'name']
            }
        ]
    },
    {
        name: 'TariffType',
        notEditOnClientSide: true,
        attributes: {
            code: Sequelize.STRING
        }
    },
    {
        name: 'OrderStatus',
        notEditOnClientSide: true,
        attributes: {
            code: Sequelize.STRING,
            isFinal: Sequelize.BOOLEAN
        }
    }
];

const devConnectionString = 'mongodb://admin:0_admin_1@ds159024.mlab.com:59024/edison-anticafe-crm-dev';
const prodConnectionString = 'mongodb://admin:0_admin_1@ds129906.mlab.com:29906/edison-anticafe-crm';


module.exports = {
    connectionStrings: {
        mongoDB: process.env.NODE_ENV === 'production' ? prodConnectionString : devConnectionString,
        sequelize: 'postgres://admin:admin@localhost:5432/edison'
    },
    sequelize: {
        alterTableOnSync: false
    },
    lookups: LOOKUPS
}