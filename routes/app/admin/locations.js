const sequelize = require('sequelize')
const Op = sequelize.Op

const tmpl = requiremain('./templates')
const { ExamLocation } = requiremain('./db/db')

const filename = require('path').parse(__filename).name

module.exports = async (req, res) => {
  const searchTerm = req.query.searchLocation ? '%'+req.query.searchLocation.toLowerCase()+'%' : null
  const LocationCount = await (
    (searchTerm) ?
    ExamLocation.count({where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), {[Op.like]: searchTerm})}) :
    ExamLocation.count()
  )
  res.tmplOpts.pageIndex = req.query.page || 1
  res.tmplOpts.pageCount = Math.ceil(LocationCount / 50)
  const offset = req.query.page ? (req.query.page-1) * 50 : 0
  const allLocations = await (
    (searchTerm) ?
    ExamLocation.findAll({where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), {[Op.like]: searchTerm}), order: [['name', 'DESC']], limit: 50, offset}) :
    ExamLocation.findAll({order: [['name', 'DESC']], limit: 50, offset})
  )
  res.tmplOpts.locations = allLocations.map(s => s.dataValues)
  res.tmplOpts.locations.forEach(s => {
    s.createdAt = new Date(s.createdAt).toLocaleDateString()
  })
  res.tmplOpts.searchQuery = req.query.searchLocation

  res.tmplOpts.activeAdminTab = filename
  tmpl.render('app/admin/' + filename + '.twig', res.tmplOpts).then(rendered => res.end(rendered))
}