const tmpl = requiremain('./templates')

const { Settings } = requiremain('./db/db')
const config = requiremain('./config')

module.exports = async (req, res) => {
  res.tmplOpts.settings = await Settings.findAll()
  tmpl.render('app/admin/settings.twig', res.tmplOpts).then(rendered => res.end(rendered))
}