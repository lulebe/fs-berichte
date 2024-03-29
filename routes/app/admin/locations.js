const sequelize = require('sequelize')
const Op = sequelize.Op

const tmpl = requiremain('./templates')
const { ExamLocation } = requiremain('./db/db')

const filename = require('path').parse(__filename).name

module.exports = async (req, res) => {
  const searchTerm = req.query.searchLocation ? '%'+req.query.searchLocation.toLowerCase().trim()+'%' : null
  const order = req.query.newestFirst ? [['createdAt', 'DESC'], ['name', 'ASC']] : [['name', 'ASC']]
  const LocationCount = await (
    (searchTerm) ?
    ExamLocation.count({where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), {[Op.like]: searchTerm})}) :
    ExamLocation.count()
  )
  res.tmplOpts.pageIndex = parseInt(req.query.page) || 1
  res.tmplOpts.pageCount = Math.ceil(LocationCount / 50)
  const offset = req.query.page ? (req.query.page-1) * 50 : 0
  const allLocations = await (
    (searchTerm) ?
    ExamLocation.findAll({where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), {[Op.like]: searchTerm}), order, limit: 50, offset}) :
    ExamLocation.findAll({order, limit: 50, offset})
  )
  res.tmplOpts.locations = allLocations
  res.tmplOpts.searchQuery = req.query.searchLocation

  res.tmplOpts.activeAdminTab = filename
  tmpl.render('app/admin/' + filename + '.twig', res.tmplOpts).then(rendered => res.end(rendered))
}