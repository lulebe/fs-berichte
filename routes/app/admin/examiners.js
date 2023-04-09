const { Op } = require('sequelize')

const tmpl = requiremain('./templates')
const { Examiner } = requiremain('./db/db')

const filename = require('path').parse(__filename).name

module.exports = async (req, res) => {
  const searchTerm = req.query.searchExaminer ? '%'+req.query.searchExaminer+'%' : null
  const ExaminerCount = await (
    (searchTerm) ?
    Examiner.count({where: {name: {[Op.like]: searchTerm}}}) :
    Examiner.count()
  )
  res.tmplOpts.pageIndex = req.query.page || 1
  res.tmplOpts.pageCount = Math.ceil(ExaminerCount / 50)
  const offset = req.query.page ? (req.query.page-1) * 50 : 0
  const allExaminers = await (
    (searchTerm) ?
    Examiner.findAll({where: {name: {[Op.like]: searchTerm}}, order: [['name', 'DESC']], limit: 50, offset}) :
    Examiner.findAll({order: [['name', 'DESC']], limit: 50, offset})
  )
  res.tmplOpts.examiners = allExaminers.map(s => s.dataValues)
  res.tmplOpts.examiners.forEach(s => {
    s.createdAt = new Date(s.createdAt).toLocaleDateString()
  })
  res.tmplOpts.searchQuery = req.query.searchExaminer

  res.tmplOpts.activeAdminTab = filename
  tmpl.render('app/admin/' + filename + '.twig', res.tmplOpts).then(rendered => res.end(rendered))
}