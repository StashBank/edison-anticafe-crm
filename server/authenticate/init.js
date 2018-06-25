const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user').User;

passport.use(new LocalStrategy(
  async function (username, password, done) {
    try {
      const user = awaitUser.find({
        where: {
          name: username
        }
      });
      if (!user) {
        return done(null, false)
      }
      if (password !== user.password) {
        return done(null, false)
      }
      return done(null, user)
    } catch (err) {
      return done(err);
    }
  }
));