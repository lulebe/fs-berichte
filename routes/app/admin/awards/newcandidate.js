const tmpl = requiremain('./templates')

const { Award } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.award = await Award.findByPk(req.params.awardid)
  tmpl.render('app/admin/awards/newcandidate.twig', res.tmplOpts).then(rendered => res.end(rendered))
}