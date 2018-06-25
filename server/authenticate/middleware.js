const reqExp = /^\/.*\.js$|^\/.*\.ts$|^\/.*\.css$|^\/.*\.html$/;
module.exports = function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated() || reqExp.test(req.url)) {
      return next()
    }
    res.redirect('/login')
  }
}