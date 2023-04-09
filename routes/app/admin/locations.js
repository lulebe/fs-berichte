const { Op } = require('sequelize')

const tmpl = require.main.require('./templates')
const { ExamLocation } = require.main.require('./db/db')

const filename = require('path').parse(__filename).name

module.exports = async (req, res) => {
  const searchTerm = req.query.searchLocation ? '%'+req.query.searchLocation.toLowerCase()+'%' : null
  const LocationCount = await (
    (searchTerm) ?
    ExamLocation.count({where: {name: {[Op.like]: searchTerm}}}) :
    ExamLocation.count()
  )
  res.tmplOpts.pageIndex = req.query.page || 1
  res.tmplOpts.pageCount = Math.ceil(LocationCount / 2)
  const offset = req.query.page ? (req.query.page-1) * 2 : 0
  const allLocations = await (
    (searchTerm) ?
    ExamLocation.findAll({where: {name: {[Op.like]: searchTerm}}, order: [['name', 'DESC']], limit: 2, offset}) :
    ExamLocation.findAll({order: [['name', 'DESC']], limit: 2, offset})
  )
  res.tmplOpts.locations = allLocations.map(s => s.dataValues)
  res.tmplOpts.locations.forEach(s => {
    s.createdAt = new Date(s.createdAt).toLocaleDateString()
  })
  res.tmplOpts.searchQuery = req.query.searchLocation

  res.tmplOpts.activeAdminTab = filename
  tmpl.render('app/admin/' + filename + '.twig', res.tmplOpts).then(rendered => res.end(rendered))
}