const md = requiremain('./markdownrender')
const tmpl = requiremain('./templates')
const { getSetting, SETTINGS_KEYS } = requiremain('./db/stored_settings')

module.exports = async (req, res) => {
  if (req.session.userId)
    return res.redirect('/app/exam')
  res.tmplOpts.isLoggedIn = false
  res.tmplOpts.isAdmin = false
  res.tmplOpts.hasError = !!req.query.status
  res.tmplOpts.errorMsg = makeMsg(parseInt(req.query.status))
  res.tmplOpts.loginGoto = req.query.goto ? '?goto=' + req.query.goto : ''
  res.tmplOpts.loginDescription = await getSetting(SETTINGS_KEYS.LOGIN_DESCRIPTION)
  res.tmplOpts.loginRegisterExplainer = md(await getSetting(SETTINGS_KEYS.LOGIN_REGISTER_EXPLAINER))
  tmpl.render('index.twig', res.tmplOpts).then(rendered => res.end(rendered))
}

function makeMsg (code) {
  switch (code) {
    case 1:
      return "Bitte die benötigten Felder ausfüllen."
    case 2:
      return "Ein neues Passwort wurde per E-Mail zugestellt."
    case 3:
      return "Passwörter stimmen nicht überein."
    case 4:
      return "E-Mail oder Passwort sind inkorrekt."
    case 5:
      return "Diese Mailadresse wird schon verwendet, nutze das Login-Formular oder die Passwort-vergessen Funktion."
    case 6:
      return "Bitte bestätige die E-Mail, die du von uns erhalten hast! Falls du auch 10 Minuten nach Registrierung keine E-Mail erhalten hast, registriere dich erneut."
    case 7:
      return "Du kannst dich nun einloggen!"
    case 8:
      return "Bitte gib eine Begründung zur Freischaltung für unsere Admins an :)"
    case 9:
      return "Unsere Admins haben deine Anfrage erhalten, du wirst eine E-Mail erhalten, wenn du freigeschaltet wurdest."
  }
}