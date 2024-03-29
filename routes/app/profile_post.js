const bcrypt = require('bcryptjs')

const config = requiremain('./config')

const { NotificationSubscription } = requiremain('./db/db')

module.exports = async (req, res, next) => {
  if (req.body.changepw) {
    if (req.body.newpw != req.body.repeatpw) return res.status(400).send()
    req.user.password = await bcrypt.hash(req.body.newpw, await bcrypt.genSalt(config.SALT_ROUNDS))
    await req.user.save()
    res.tmplOpts.pwChanged = true
  }
  if (req.body.changename) {
    req.user.nickname = req.body.nickname || null
    req.user.anonymous = !!req.body.anonymous
    await req.user.save()
  }
  if (req.body.removeNotificationSubscriptions) {
    await NotificationSubscription.destroy({where: {UserId: req.user.id}})
  }
  next()
}