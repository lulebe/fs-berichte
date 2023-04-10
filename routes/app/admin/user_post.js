const bcrypt = require('bcryptjs')

const config = requiremain('./config')
const { User } = requiremain('./db/db')

module.exports = async (req, res, next) => {
  const user = await User.findByPk(req.params.id)
  if (req.body.newpw) {
    if (req.body.newpw != req.body.repeatpw) return res.status(400).send()
    req.user.password = await bcrypt.hash(req.body.newpw, await bcrypt.genSalt(config.SALT_ROUNDS))
    await req.user.save()
    res.tmplOpts.pwChanged = true
  }
  if (req.body.toggleAdmin == "yes") {
    user.isAdmin = !user.isAdmin
    await user.save()
    res.tmplOpts.adminChanged = true
  }
  if (req.body.deleteAccount == "yes") {
    await user.destroy()
    return res.redirect('/app/admin/users')
  }
  next()
}