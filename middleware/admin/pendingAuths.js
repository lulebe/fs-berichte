const { User } = require.main.require('./db/db')

module.exports = async function (req, res, next) {
  if (req.query.acceptAuth) {
    const authUser = await User.findByPk(req.query.acceptAuth)
    if (authUser) {
      authUser.authorized = true
      authUser.activated = true
      await authUser.save()
    }
  }
  if (req.query.deleteAuth) {
    const authUser = await User.findByPk(req.query.deleteAuth)
    if (authUser)
      await authUser.destroy()
  }
  res.tmplOpts.pendingAuths = await User.findAll({where: {authorized: false}})
  next()
}