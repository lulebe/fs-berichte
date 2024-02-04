const md = requiremain('./markdownrender')

const { User, Settings } = requiremain('./db/db')

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
    await Settings.set(Settings.KEYS.RESEARCH_REPORTS_PUBLIC, req.query.setResearch === 'public')
  }
  if (req.body.loginDescription)
    await Settings.set(Settings.KEYS.LOGIN_DESCRIPTION, req.body.loginDescription)
  if (req.body.loginRegisterExplainer)
    await Settings.set(Settings.KEYS.LOGIN_REGISTER_EXPLAINER, req.body.loginRegisterExplainer)
  if (req.body.authorizedDomain)
    await Settings.set(Settings.KEYS.AUTHORIZED_DOMAIN, req.body.authorizedDomain.toLowerCase())
  if (req.body.userActiveDuration)
    await Settings.set(Settings.KEYS.USER_ACTIVE_DURATION, req.body.userActiveDuration)
  res.tmplOpts.loginTexts = {}
  res.tmplOpts.loginTexts.loginDescription = await Settings.get(Settings.KEYS.LOGIN_DESCRIPTION)
  res.tmplOpts.loginTexts.loginRegisterExplainer = await Settings.get(Settings.KEYS.LOGIN_REGISTER_EXPLAINER)
  res.tmplOpts.loginTexts.loginRegisterExplainerRendered = md(res.tmplOpts.loginTexts.loginRegisterExplainer)
  res.tmplOpts.pendingAuths = await User.findAll({where: {authorized: false}})
  res.tmplOpts.userActiveDuration = await Settings.get(Settings.KEYS.USER_ACTIVE_DURATION)
  res.tmplOpts.researchReportsPublic = !!(await Settings.get(Settings.KEYS.RESEARCH_REPORTS_PUBLIC))
  res.tmplOpts.authorizedDomain = await Settings.get(Settings.KEYS.AUTHORIZED_DOMAIN)
  next()
}