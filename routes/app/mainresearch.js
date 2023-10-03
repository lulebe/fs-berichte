const tmpl = requiremain('./templates')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const { ResearchReport } = requiremain('./db/db')
const { getSetting, SETTINGS_KEYS } = requiremain('./db/stored_settings')

module.exports = async (req, res) => {
  res.tmplOpts.researchReportsPublic = (await getSetting(SETTINGS_KEYS.RESEARCH_REPORTS_PUBLIC)) === '1'
  const where = {}
  if (req.query.subject)
    where.subject = {[Op.like]: '%'+req.query.subject+'%'}
  if (req.query.head)
    where.head = {[Op.like]: '%'+req.query.head+'%'}
  if (req.query.supervisor)
    where.supervisor = {[Op.like]: '%'+req.query.supervisor+'%'}
  const results = await ResearchReport.findAll({where, limit: 50, offset: 0, order: [['createdAt', 'DESC']]})
  results.forEach(r => {
    r.readableDate = new Date(r.createdAt).toLocaleDateString('de-DE')
  })
  res.tmplOpts.results = results
  res.tmplOpts.query = req.query
  tmpl.render('app/mainresearch.twig', res.tmplOpts).then(rendered => res.end(rendered))
}