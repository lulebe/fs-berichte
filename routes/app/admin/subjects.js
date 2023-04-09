const { Op } = require('sequelize')

const tmpl = requiremain('./templates')
const { Subject } = requiremain('./db/db')

const filename = require('path').parse(__filename).name

module.exports = async (req, res) => {
  const searchTerm = req.query.searchSubject ? '%'+req.query.searchSubject.toLowerCase()+'%' : null
  const SubjectCount = await (
    (searchTerm) ?
    Subject.count({where: {name: {[Op.like]: searchTerm}}}) :
    Subject.count()
  )
  res.tmplOpts.pageIndex = req.query.page || 1
  res.tmplOpts.pageCount = Math.ceil(SubjectCount / 2)
  const offset = req.query.page ? (req.query.page-1) * 2 : 0
  const allSubjects = await (
    (searchTerm) ?
    Subject.findAll({where: {name: {[Op.like]: searchTerm}}, order: [['name', 'DESC']], limit: 2, offset}) :
    Subject.findAll({order: [['name', 'DESC']], limit: 2, offset})
  )
  res.tmplOpts.subjects = allSubjects.map(s => s.dataValues)
  res.tmplOpts.subjects.forEach(s => {
    s.createdAt = new Date(s.createdAt).toLocaleDateString()
  })
  res.tmplOpts.searchQuery = req.query.searchSubject

  res.tmplOpts.activeAdminTab = filename
  tmpl.render('app/admin/' + filename + '.twig', res.tmplOpts).then(rendered => res.end(rendered))
}