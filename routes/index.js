const tmpl = requiremain('./templates')

module.exports = (req, res) => {
  if (req.session.userId)
    return res.redirect('/app/main')
  const opts = {
    isLoggedIn: false,
    isAdmin: false,
    hasError: !!req.query.status,
    errorMsg: makeMsg(parseInt(req.query.status)),
    loginGoto: req.query.goto ? '?goto=' + req.query.goto : ''
  }
  tmpl.render('index.twig', opts).then(rendered => res.end(rendered))
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
  }
}