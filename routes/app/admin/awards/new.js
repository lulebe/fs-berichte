const tmpl = requiremain('./templates')

const {  } = requiremain('./db/db')

module.exports = async (req, res) => {
  tmpl.render('app/admin/awards/new.twig', res.tmplOpts).then(rendered => res.end(rendered))
}