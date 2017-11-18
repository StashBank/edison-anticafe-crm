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
        caption: 'Продукти'
    },
    {
        name: 'Tariff',
        caption: 'Тарифи'
    }
];

module.exports = {
    connectionStrings: {
        mongoDB: 'mongodb://admin:0_admin_1@ds159024.mlab.com:59024/edison-anticafe-crm-dev'
    }, 
    lookups: LOOKUPS
}