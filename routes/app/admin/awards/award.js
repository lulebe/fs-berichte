const tmpl = requiremain('./templates')

const { Award, AwardCandidate } = requiremain('./db/db')

module.exports = async (req, res) => {
  const award = await Award.findByPk(req.params.id, {include: [{model: AwardCandidate}], order: [[AwardCandidate, 'position', 'asc']]})
  res.tmplOpts.award = award
  if (!award) return res.redirect('/app/admin/awards')
  tmpl.render('app/admin/awards/award.twig', res.tmplOpts).then(rendered => res.end(rendered))
}