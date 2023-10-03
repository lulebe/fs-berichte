const sequelize = require('sequelize')
const { ResearchReport } = requiremain('./db/db')

module.exports = async (req, res) => {
  req.body.UserId = req.user.id
  const report = await ResearchReport.create(req.body)
  res.redirect('/app/research/'+report.id)
}