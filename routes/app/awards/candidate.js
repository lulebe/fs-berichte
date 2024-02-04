const Sequelize = require('sequelize')

const md = requiremain('./markdownrender')
const tmpl = requiremain('./templates')
const { Award, AwardCandidate, CandidateImage, AwardVote } = requiremain('./db/db')

module.exports = async (req, res) => {
  const candidate = await AwardCandidate.findByPk(req.params.candidateid, {include: [{model: CandidateImage, attributes: ['id', 'type']}]})
  if (!candidate) return res.status(404).send()
  const award = await Award.findByPk(candidate.AwardId, {include: [
      {model: AwardCandidate, include: [{model: CandidateImage, attributes: ['id', 'type']}]}
  ],order: [[AwardCandidate, 'position', 'asc']]})
  if (!award) return res.redirect('/app/awards')
  res.tmplOpts.award = award
  candidate.longDescriptionHtml = md(candidate.longDescription)
  res.tmplOpts.candidate = candidate
  if (req.user && (await req.user.hasAuthorizedDomain()))
    res.tmplOpts.userVote = await AwardVote.findOne({where: {UserId: req.user.id, AwardId: req.params.awardid}, include: [AwardCandidate]})
  const voteCountData = await AwardVote.findAll({where: {AwardId: award.id}, group: ['AwardCandidateId'], order: [['count', 'DESC']], include: [{model: AwardCandidate, attributes: ['id', 'name']}], attributes: [[Sequelize.fn('COUNT', Sequelize.col('AwardCandidateId')), 'count']]})
  award.AwardCandidates.forEach(c => {
    if (!voteCountData.some(vc => vc.AwardCandidate.id === c.id))
      voteCountData.push({AwardCandidate: {id: c.id, name: c.name}, count: 0})
  })
  voteCountData.sort((a, b) => b.count - a.count)
  res.tmplOpts.voteCounts = voteCountData
  tmpl.render('app/awards/candidate.twig', res.tmplOpts).then(rendered => res.end(rendered))
}