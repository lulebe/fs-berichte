const { User } = requiremain('./db/db')
const { getSetting, setSetting, SETTINGS_KEYS } = requiremain('./db/stored_settings')

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
  if (req.query.setResearch) {
    await setSetting(SETTINGS_KEYS.RESEARCH_REPORTS_PUBLIC, req.query.setResearch === 'public')
  }
  res.tmplOpts.pendingAuths = await User.findAll({where: {authorized: false}})
  res.tmplOpts.researchReportsPublic = (await getSetting(SETTINGS_KEYS.RESEARCH_REPORTS_PUBLIC)) === '1'
  next()
}