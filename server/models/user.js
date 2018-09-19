const settings = require('../setttings');
const db = require('../db/sequelize');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const DataTypes = Sequelize;
const alterTableOnSync = settings.sequelize.alterTableOnSync;
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: { type: Sequelize.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  login: { type:DataTypes.TEXT, unique: true },
  name: { type:DataTypes.TEXT },
  password: DataTypes.TEXT,
  active: DataTypes.BOOLEAN,
  email: DataTypes.TEXT,
  phone: DataTypes.TEXT,
  isAdmin: DataTypes.BOOLEAN
});

const encryptedPassword = '$2b$12$hPTi3zXzhBGZk7TViip8ueO58mvsE.vi8b2NIUf5kqoPTVpk0KmB6'
const adminUser = {
  login: 'admin',
  password: encryptedPassword,
  active: true,
  email: 'admin@email.com',
  isAdmin: true
}
User.findOne({
  where: { login: 'admin'}
}).then(user => {
  if (!user) {
    User.create(adminUser);
  } else {
    if (user.password !== encryptedPassword) {
      user.update({ password: encryptedPassword });
    }
    if (!user.isAdmin) {
      user.update({ isAdmin: true });
    }
  }
});


/*User.sync({ alter: true })
  .then(() => console.log('sequelize Users has been synchronized'))
  .catch((err) => { console.log('sequelize Users has not been synchronized'); throw err });*/
  

module.exports = { User };