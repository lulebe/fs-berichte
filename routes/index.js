const md = requiremain('./markdownrender')
const tmpl = requiremain('./templates')
const { Settings } = requiremain('./db/db')
const config = requiremain('./config')

module.exports = async (req, res) => {
  if (req.session.userId)
    return res.redirect('/app/exam')
  res.tmplOpts.isLoggedIn = false
  res.tmplOpts.isAdmin = false
  res.tmplOpts.hasError = !!req.query.status
  res.tmplOpts.errorMsg = makeMsg(parseInt(req.query.status))
  res.tmplOpts.loginGoto = req.query.goto ? '?goto=' + req.query.goto : ''
  res.tmplOpts.loginDescription = await Settings.get(Settings.KEYS.LOGIN_DESCRIPTION)
  res.tmplOpts.loginRegisterExplainer = md(await Settings.get(Settings.KEYS.LOGIN_REGISTER_EXPLAINER))
  res.tmplOpts.authorizedDomain = await Settings.get(Settings.KEYS.AUTHORIZED_DOMAIN)
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
    case 10:
      return "Dein Account ist abgelaufen. Du hast eine E-Mail mit einem Link zur Verlängerung erhalten."
    case 11:
      return `Dein Account ist abgelaufen. Da du eine externe Mailadresse hast, können dich nur unsere Admins (${config.ADMIN_EMAIL}) verlängern.`
  }
}