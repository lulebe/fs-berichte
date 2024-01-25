const { AwardCandidate, Award, AwardVote } = requiremain('./db/db')

module.exports = async (req, res, next) => {
  const award = await Award.findByPk(req.params.awardid)
  if (!award) return res.status(404).send()
  const candidate = await AwardCandidate.findByPk(req.params.candidateid)
  if (!candidate) return res.status(404).send()
  const vote = await AwardVote.findOne({where: {UserId: req.user.id, AwardId: award.id}})
  if (vote) {
    vote.AwardCandidateId = candidate.id
    await vote.save()
  } else
    await AwardVote.create({UserId: req.user.id, AwardId: award.id, AwardCandidateId: candidate.id})
  res.redirect(`/app/awards/${award.id}/candidates/${candidate.id}`)
}