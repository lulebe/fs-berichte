const { User } = requiremain('./db/db')

module.exports = async function (req, res, next) {
  if (!req.session.userId) {
    const goto = req.originalUrl != '/app/logout' ? '?goto=' + encodeURIComponent(req.originalUrl) : ''
    return res.redirect('/' + goto)
  }
  req.user = await User.findByPk(req.session.userId)
  if (!req.user) {
    req.session.destroy()
    return res.redirect('/')
  }
  res.tmplOpts.isLoggedIn = true
  res.tmplOpts.user = req.user
  res.tmplOpts.isAdmin = req.user.isAdmin
  next()
}