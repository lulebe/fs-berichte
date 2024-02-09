const Sequelize = require('sequelize')
const tmpl = requiremain('./templates')

const md = requiremain('./markdownrender')
const { Award, AwardCandidate, CandidateImage, AwardVote } = requiremain('./db/db')

module.exports = async (req, res) => {
  const award = await Award.findByPk(req.params.id, {include: [
      {model: AwardCandidate, include: [{model: CandidateImage, attributes: ['id', 'type']}]}
  ],order: [[AwardCandidate, 'position', 'asc']]})
  if (!award) return res.redirect('/app/awards')
  res.tmplOpts.award = award
  if (req.user && req.user.isAwardsUser)
    res.tmplOpts.userVote = await AwardVote.findOne({where: {UserId: req.user.id, AwardId: award.id}, include: [AwardCandidate]})
  const voteCountData = await AwardVote.findAll({where: {AwardId: award.id}, group: ['AwardCandidateId'], order: [['count', 'DESC']], include: [{model: AwardCandidate, attributes: ['id', 'name']}], attributes: [[Sequelize.fn('COUNT', Sequelize.col('AwardCandidateId')), 'count']]})
  award.AwardCandidates.forEach(c => {
    if (!voteCountData.some(vc => vc.AwardCandidate.id === c.id))
      voteCountData.push({AwardCandidate: {id: c.id, name: c.name}, count: 0})
  })
  voteCountData.sort((a, b) => b.count - a.count)
  res.tmplOpts.voteCounts = voteCountData
  res.tmplOpts.totalVotes = await AwardVote.count({where: {AwardId: award.id}})
  tmpl.render('app/awards/award.twig', res.tmplOpts).then(rendered => res.end(rendered))
}