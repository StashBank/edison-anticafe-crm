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

const devConnectionString = 'mongodb://admin:0_admin_1@ds159024.mlab.com:59024/edison-anticafe-crm-dev';
const prodConnectionString = 'mongodb://admin:0_admin_1@ds129906.mlab.com:29906/edison-anticafe-crm';


module.exports = {
    connectionStrings: {
        mongoDB: process.env.NODE_ENV === 'production' ? prodConnectionString : devConnectionString
    }, 
    lookups: LOOKUPS
}