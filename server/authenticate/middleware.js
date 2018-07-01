const reqExp = /^\/.*\.js$|^\/.*\.js.map$|^\/.*\.ico$|^\/.*\.ts$|^\/.*\.css$|^\/.*\.css.map$|^\/.*\.html$/;
module.exports = function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated() || reqExp.test(req.url)) {
      return next()
    }
    if (req.url.startsWith('/api/') && !req.url.startsWith('/api/userService')) {
      res.status(401).send({ url: req.url })
    } else {
      res.redirect('/login');
    } 
  }
}