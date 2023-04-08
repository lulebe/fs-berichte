const tmpl = require.main.require('./templates')

module.exports = (req, res) => {
  if (req.session.userId)
    return res.redirect('/app/main')
  const opts = {
    isLoggedIn: false,
    isAdmin: false,
    hasError: !!req.query.status,
    errorMsg: makeMsg(req.query.status),
    loginGoto: req.query.goto ? '?goto=' + req.query.goto : '',
    currentYear: new Date().getFullYear()
  }
  tmpl.render('index.twig', opts).then(rendered => res.end(rendered))
}

function makeMsg (code) {
  switch (code) {
    case 0:
      return "Bitte die benötigten Felder ausfüllen."
    case 1:
      return "Ein neues Passwort wurde per E-Mail zugestellt."
    case 2:
      return "Passwörter stimmen nicht überein."
    case 3:
      return "E-Mail oder Passwort sind inkorrekt."
    case 4:
      return "Diese Mailadresse wird schon verwendet, nutze das Login-Formular oder die Passwort-vergessen Funktion."
    case 5:
      return "Bitte bestätige die E-Mail, die du von uns erhalten hast! Falls du auch nach 10 Minuten keine E-Mail erhalten hast, registriere dich erneut."
    case 6:
      return "Du kannst dich nun einloggen!"
  }
}