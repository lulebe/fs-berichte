const sequelize = require('sequelize')
const Op = sequelize.Op

const tmpl = requiremain('./templates')
const { Examiner } = requiremain('./db/db')

const filename = require('path').parse(__filename).name

module.exports = async (req, res) => {
  const searchTerm = req.query.searchExaminer ? '%'+req.query.searchExaminer.toLowerCase().trim()+'%' : null
  const order = req.query.newestFirst ? [['createdAt', 'DESC'], ['name', 'ASC']] : [['name', 'ASC']]
  const ExaminerCount = await (
    (searchTerm) ?
    Examiner.count({where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), {[Op.like]: searchTerm})}) :
    Examiner.count()
  )
  res.tmplOpts.pageIndex = parseInt(req.query.page) || 1
  res.tmplOpts.pageCount = Math.ceil(ExaminerCount / 50)
  const offset = req.query.page ? (req.query.page-1) * 50 : 0
  const allExaminers = await (
    (searchTerm) ?
    Examiner.findAll({where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), {[Op.like]: searchTerm}), order, limit: 50, offset}) :
    Examiner.findAll({order, limit: 50, offset})
  )
  res.tmplOpts.examiners = allExaminers
  res.tmplOpts.searchQuery = req.query.searchExaminer

  res.tmplOpts.activeAdminTab = filename
  tmpl.render('app/admin/' + filename + '.twig', res.tmplOpts).then(rendered => res.end(rendered))
}