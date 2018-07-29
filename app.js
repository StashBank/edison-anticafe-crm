const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const session = require('express-session')
const MemoryStore = require('memorystore')(session);
const passport = require('passport');
const config = require('./server/config');
const LocalStrategy = require('passport-local').Strategy
const User = require('./server/models/user').User;
const authenticationMiddleware = require('./server/authenticate/middleware');
const bcrypt = require('bcrypt');
var api = require('./server/api');
var app = express();
const HOUR_PERIOD = 3600000;

app.use(session({
  store: new MemoryStore({
    checkPeriod: HOUR_PERIOD * 1
  }),
  secret: config.memoryStore.secret,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const options = {
  index: 'index.html'
};

//app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.post('/login',
  function() {
    passport.authenticate('local', { failureRedirect: '/login' }).apply(passport, arguments);
  },
  function (req, res) {
    // res.redirect('/');
    const { id, login, name, isAdmin } = req.user;
    const userName = name || login
    res.send({ id, name: userName, isAdmin });
  }
);

app.post('/logout', (req, res) => {
  req.logout();
  // res.redirect('/login');
  res.send(null);
});

passport.use(new LocalStrategy(
  async function (username, password, done) {
    try {
      const user = await User.findOne({
        where: {
          login: username
        }
      });
      if (!user) {
        return done(null, false)
      }
      // const encryptedPassword = bcrypt.hashSync(password, user.salt || 12);
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false)
      }
      return done(null, user)
    } catch (err) {
      return done(err);
    }
  }
));
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser( async function (id, done) {
  let user, err;
  try {
    user = await User.findById(id);
  } catch (ex) {
    err = ex;
  }
  done(err, user);
});

if (app.get('env') !== 'production') {

  //options.index = 'index.dev.html';

  // expose node_modules to client app
  app.use(express.static(__dirname + "/node_modules"));
}
app.use(express.static(__dirname + "/node_modules"));

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));
app.use(authenticationMiddleware());
app.use(express.static(path.join(__dirname, 'dist'), options));


// Routes registration
app.use('/api', api);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found: ' + req.url);
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
