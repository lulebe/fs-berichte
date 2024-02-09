const bcrypt = require('bcryptjs')

const config = requiremain('./config')
const { User } = requiremain('./db/db')

module.exports = async (req, res, next) => {
  const user = await User.findByPk(req.params.id)
  if (req.body.changePW) {
    if (req.body.newpw != req.body.repeatpw) return res.status(400).send()
    req.user.password = await bcrypt.hash(req.body.newpw, await bcrypt.genSalt(config.SALT_ROUNDS))
    await req.user.save()
    res.tmplOpts.pwChanged = true
  }
  if (req.body.toggleAdmin == "yes") {
    user.isAdmin = !user.isAdmin
    await user.save()
    res.tmplOpts.permissionsChanged = true
  }
  if (req.body.toggleAwardsAdmin == "yes") {
    user.awardsAdmin = !user.awardsAdmin
    await user.save()
    res.tmplOpts.permissionsChanged = true
  }
  if (req.body.togglePetitionsAdmin == "yes") {
    user.petitionsAdmin = !user.petitionsAdmin
    await user.save()
    res.tmplOpts.permissionsChanged = true
  }
  if (req.body.toggleFormsAdmin == "yes") {
    user.formsAdmin = !user.formsAdmin
    await user.save()
    res.tmplOpts.permissionsChanged = true
  }
  if (req.body.toggleModerator == "yes") {
    user.moderator = !user.moderator
    await user.save()
    res.tmplOpts.permissionsChanged = true
  }
  if (req.body.toggleReportsUser == "yes") {
    user.isReportsUser = !user.isReportsUser
    await user.save()
    res.tmplOpts.permissionsChanged = true
  }
  if (req.body.toggleAwardsUser == "yes") {
    user.isAwardsUser = !user.isAwardsUser
    await user.save()
    res.tmplOpts.permissionsChanged = true
  }
  if (req.body.togglePetitionsUser == "yes") {
    user.isPetitionsUser = !user.isPetitionsUser
    await user.save()
    res.tmplOpts.permissionsChanged = true
  }
  if (req.body.toggleFormsUser == "yes") {
    user.isFormsUser = !user.isFormsUser
    await user.save()
    res.tmplOpts.permissionsChanged = true
  }
  if (req.body.extendAccount == "yes") {
    const extendedUntil = new Date().setFullYear(new Date().getFullYear() + 1)
    if (await user.activeUntil() < extendedUntil) {
      user.extendedUntil = extendedUntil
      await user.save()
      res.tmplOpts.extended = true
    }
  }
  if (req.body.deleteAccount == "yes") {
    await user.destroy()
    return res.redirect('/app/admin/users')
  }
  next()
}