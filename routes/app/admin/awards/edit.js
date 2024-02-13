const { Award, AwardCandidate, User } = requiremain('./db/db')

module.exports = async (req, res) => {
  const award = await Award.findByPk(req.params.id)
  if (!award) return res.status(404).send()
  if (req.body.candidateOrder) {
    try {
      await Promise.all(req.body.candidateOrder.map((id, i) => {
        return AwardCandidate.update({position: i}, {where: {id: id}})
      }))
    } catch (e) {
      return res.status(500).send(e.message)
    }
  }
  if (award.status === Award.STATUS.UNPUBLISHED && req.body.status === Award.STATUS.PUBLISHED) {
    User.notifyWhere({isAwardsUser: true}, 'Neuer PaLMe-Award', award.title, '/app/awards/' + award.id)
  }
  if (req.body.title) award.title = req.body.title
  if (req.body.description) award.description = req.body.description
  if (req.body.votingDeadline) award.votingDeadline = req.body.votingDeadline
  if (req.body.status != undefined) award.status = req.body.status
  try {
    await award.save()
  } catch (e) {
    return res.status(500).send(e.message)
  }
  res.status(200).send(award)
}