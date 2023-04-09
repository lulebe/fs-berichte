const tmpl = requiremain('./templates')

module.exports = async (req, res) => {
  tmpl.render('app/admin/createexamtype.twig', res.tmplOpts).then(rendered => res.end(rendered))
}