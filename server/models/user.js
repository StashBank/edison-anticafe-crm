const settings = require('../setttings');
const db = require('../db/sequelize');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const DataTypes = Sequelize;
const alterTableOnSync = settings.sequelize.alterTableOnSync;

const User = sequelize.define('User', {
  id: { type: Sequelize.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  login: DataTypes.TEXT,
  password: DataTypes.TEXT,
  active: DataTypes.BOOLEAN,
  email: DataTypes.TEXT,
  phone: DataTypes.TEXT,
  isAdmin: DataTypes.BOOLEAN
});

const adminUser = {
  login: 'admin',
  password: '12345678',
  active: true,
  email: 'admin@email.com',
  isAdmin: true
}
User.findOne({
  where: { login: 'admin'}
}).then(user => {
  if (!user) {
    User.create(adminUser);
  }
})

// Income.sync({ alter: alterTableOnSync })
User.sync({ alter: true })
  .then(() => console.log('sequelize Users has been synchronized'))
  .catch((err) => { console.log('sequelize Users has not been synchronized'); throw err });

module.exports = { User };