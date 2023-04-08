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
      return "E-Mail nicht gefunden. Bei Bedarf Admins informieren."
    case 3:
      return "E-Mail oder Passwort sind inkorrekt."
  }
}