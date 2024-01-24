const md = require('markdown-it')()
const tmpl = requiremain('./templates')

const { Award, AwardCandidate, CandidateImage, AwardVote } = requiremain('./db/db')

module.exports = async (req, res) => {
  const award = await Award.findByPk(1, {include: [
      {model: AwardCandidate, include: [{model: CandidateImage, attributes: ['id', 'type']}]},
      {model: AwardVote, where: {id: req.user.id}, required: false}
  ],order: [[AwardCandidate, 'position', 'asc']]})
  res.tmplOpts.award = award
  tmpl.render('app/awards/award.twig', res.tmplOpts).then(rendered => res.end(rendered))
}