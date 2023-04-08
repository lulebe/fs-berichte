const tmpl = require.main.require('./templates')

module.exports = async (req, res) => {
  tmpl.render('app/main.twig', res.tmplOpts).then(rendered => res.end(rendered))
}