const tmpl = requiremain('./templates')

const { Award } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.awards = await Award.findAll({order: [['id', 'DESC']]})
  tmpl.render('app/admin/awards.twig', res.tmplOpts).then(rendered => res.end(rendered))
}