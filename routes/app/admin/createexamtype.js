const tmpl = requiremain('./templates')

module.exports = async (req, res) => {
  res.tmplOpts.activeAdminTab = "examtypes"
  tmpl.render('app/admin/createexamtype.twig', res.tmplOpts).then(rendered => res.end(rendered))
}