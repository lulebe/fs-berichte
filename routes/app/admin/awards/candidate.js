const md = require('markdown-it')()

const tmpl = requiremain('./templates')
const { Award, AwardCandidate, CandidateImage } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.award = await Award.findByPk(req.params.awardid)
  const candidate = await AwardCandidate.findByPk(req.params.candidateid, {include: [{model: CandidateImage, attributes: ['id', 'type']}]})
  candidate.longDescriptionHtml = md.render(candidate.longDescription).replaceAll('<a', '<a target="_blank"')
  res.tmplOpts.candidate = candidate
  tmpl.render('app/admin/awards/candidate.twig', res.tmplOpts).then(rendered => res.end(rendered))
}