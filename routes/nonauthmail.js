const tmpl = requiremain('./templates')

module.exports = (req, res) => {
  if (req.session.userId)
    return res.redirect('/app/main')
  const opts = {
    email: req.query.email
  }
  tmpl.render('nonauthmail.twig', opts).then(rendered => res.end(rendered))
}