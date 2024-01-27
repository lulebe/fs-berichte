const md = requiremain('./markdownrender')

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
  if (req.body.loginDescription)
    await setSetting(SETTINGS_KEYS.LOGIN_DESCRIPTION, req.body.loginDescription)
  if (req.body.loginRegisterExplainer)
    await setSetting(SETTINGS_KEYS.LOGIN_REGISTER_EXPLAINER, req.body.loginRegisterExplainer)
  res.tmplOpts.loginTexts = {}
  res.tmplOpts.loginTexts.loginDescription = await getSetting(SETTINGS_KEYS.LOGIN_DESCRIPTION)
  res.tmplOpts.loginTexts.loginRegisterExplainer = await getSetting(SETTINGS_KEYS.LOGIN_REGISTER_EXPLAINER)
  res.tmplOpts.loginTexts.loginRegisterExplainerRendered = md(res.tmplOpts.loginTexts.loginRegisterExplainer)
  res.tmplOpts.pendingAuths = await User.findAll({where: {authorized: false}})
  res.tmplOpts.researchReportsPublic = (await getSetting(SETTINGS_KEYS.RESEARCH_REPORTS_PUBLIC)) === '1'
  next()
}