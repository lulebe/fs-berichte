const tmpl = requiremain('./templates')

const { Award, AwardCandidate } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.award = await Award.findByPk(req.params.id, {include: [{model: AwardCandidate}], order: [[AwardCandidate, 'position', 'asc']]})
  tmpl.render('app/admin/awards/award.twig', res.tmplOpts).then(rendered => res.end(rendered))
}