const Sequelize = require('sequelize');
const connectionStrings = require('../setttings').connectionStrings;
const sequelize = new Sequelize(connectionStrings.sequelize, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true
  }
});

module.exports = {
  Sequelize,
  sequelize
};