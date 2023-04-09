const { User } = require.main.require('./db/db')

module.exports = async function (req, res, next) {
  if (!req.session.userId) {
    const goto = req.originalUrl != '/app/logout' ? '?goto=' + encodeURIComponent(req.originalUrl) : ''
    return res.redirect('/' + goto)
  }
  res.tmplOpts.isLoggedIn = true
  req.user = await User.findByPk(req.session.userId)
  res.tmplOpts.user = req.user.dataValues
  next()
}