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
                attributes: ['id', 'name', "cost"]
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
                as: 'children',
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
    },
    {
        name: 'ExpenseType',
        caption: 'Тип витрат',
        attributes: {
            code: Sequelize.STRING
        }
    },
    {
        name: 'IncomeType',
        caption: 'Тип доходів',
        attributes: {
            code: Sequelize.STRING
        }
    }
];

const devConnectionString = 'mongodb://admin:0_admin_1@ds159024.mlab.com:59024/edison-anticafe-crm-dev';
const prodConnectionString = 'mongodb://admin:0_admin_1@ds129906.mlab.com:29906/edison-anticafe-crm';

const SEQUELIZE_CONNECTION = {
  PROD: 'postgres://uzmoekxlksvppv:c2f108051c08ad9a464802a96c899e0dc23367158d7e08e38764da3b5f447024@ec2-54-225-68-71.compute-1.amazonaws.com:5432/djk2tiqstbcof?ssl=true',
  DEV: "postgres://szoetooeucvmyh:966b35e8588f848607932649161e2b7b8f8ad14d15c5a8a48c3c17ab270d9a7d@ec2-54-235-70-253.compute-1.amazonaws.com:5432/d1d51e5ai1r9t0" // 'postgres://admin:admin@localhost:5432/edison'
}


module.exports = {
    connectionStrings: {
        mongoDB: process.env.NODE_ENV === 'production'
            ? prodConnectionString
            : devConnectionString,
        sequelize: process.env.DATABASE_URL || (
            process.env.NODE_ENV === 'production' ? SEQUELIZE_CONNECTION.PROD : SEQUELIZE_CONNECTION.DEV
        )
    },
    sequelize: {
        alterTableOnSync: false
    },
    lookups: LOOKUPS
}