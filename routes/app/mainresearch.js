const tmpl = requiremain('./templates')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const { ResearchReport, Settings } = requiremain('./db/db')

module.exports = async (req, res) => {
  const where = {publishDate: {[Op.lte]: new Date()}}
  res.tmplOpts.canView = req.user.isAdmin || !!(await Settings.get(Settings.KEYS.RESEARCH_REPORTS_PUBLIC))
  if (req.query.subject)
    where.subject = {[Op.like]: '%'+req.query.subject+'%'}
  if (req.query.head)
    where.head = {[Op.like]: '%'+req.query.head+'%'}
  if (req.query.supervisor)
    where.supervisor = {[Op.like]: '%'+req.query.supervisor+'%'}
  const results = await ResearchReport.findAll({where, limit: 50, offset: 0, order: [['createdAt', 'DESC']]})
  res.tmplOpts.results = results
  res.tmplOpts.query = req.query
  tmpl.render('app/mainresearch.twig', res.tmplOpts).then(rendered => res.end(rendered))
}