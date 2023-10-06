const sequelize = require('sequelize')
const { ResearchReport } = requiremain('./db/db')

module.exports = async (req, res) => {
  req.body.UserId = req.user.id
  req.body.head = fixPersonName(req.body.head)
  req.body.supervisor = fixPersonName(req.body.supervisor)
  const report = await ResearchReport.create(req.body)
  res.redirect('/app/research/'+report.id)
}

function fixPersonName (name) {
  name = name.replaceAll('Dr', '')
  name = name.replaceAll('Prof', '')
  name = name.replaceAll('Med', '')
  name = name.replaceAll('dr', '')
  name = name.replaceAll('prof', '')
  name = name.replaceAll('med', '')
  name = name.replaceAll('PD', '')
  name = name.replaceAll('pd', '')
  name = name.replaceAll('Pd', '')
  name = name.replaceAll('.', '')
  name = name.trim()
  return name
}