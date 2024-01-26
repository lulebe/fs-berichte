const { Award } = requiremain('./db/db')

module.exports = async (req, res) => {
  const award = await Award.findByPk(req.params.id)
  if (!award) return res.status(404).send()
  await award.destroy()
  res.status(204).send()
}