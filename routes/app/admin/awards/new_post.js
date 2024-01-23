const { Award } = requiremain('./db/db')

module.exports = async (req, res) => {
  const award = await Award.create({
    title: req.body.title,
    description: req.body.description,
    votingDeadline: req.body.deadline,
    status: Award.STATUS.UNPUBLISHED
  })
  res.redirect('/app/admin/awards/'+award.id)
}