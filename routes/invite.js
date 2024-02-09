const md = requiremain('./markdownrender')
const tmpl = requiremain('./templates')
const { Settings } = requiremain('./db/db')
const config = requiremain('./config')

module.exports = async (req, res) => {
  if (req.session.userId)
    return res.redirect('/app/main')
  res.tmplOpts.isLoggedIn = false
  res.tmplOpts.hasError = !!req.query.status
  res.tmplOpts.errorMsg = makeMsg(parseInt(req.query.status))
  res.tmplOpts.loginDescription = await Settings.get(Settings.KEYS.LOGIN_DESCRIPTION)
  res.tmplOpts.loginRegisterExplainer = md(await Settings.get(Settings.KEYS.LOGIN_REGISTER_EXPLAINER))
  tmpl.render('invite.twig', res.tmplOpts).then(rendered => res.end(rendered))
}

function makeMsg (code) {
  switch (code) {
    case 1:
      return "Bitte die benötigten Felder ausfüllen."
    case 3:
      return "Passwörter stimmen nicht überein."
    case 5:
      return "Diese Mailadresse wird schon verwendet, nutzen Sie das Login-Formular oder die Passwort-vergessen Funktion."
    case 6:
      return "Bitte bestätigen Sie die E-Mail, die du von uns erhalten hast!"
  }
}