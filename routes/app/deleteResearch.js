const { ResearchReport } = requiremain('./db/db')

module.exports = async (req, res) => {
  const report = await ResearchReport.findByPk(req.params.id)
  if (!req.user.isAdmin && report.UserId !== req.user.id) return res.status(403).send()
  await report.destroy()
  res.redirect('/app/research')
}