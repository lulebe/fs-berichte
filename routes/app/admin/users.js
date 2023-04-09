const { Op } = require('sequelize')

const tmpl = requiremain('./templates')
const { User } = requiremain('./db/db')

const filename = require('path').parse(__filename).name

module.exports = async (req, res) => {
  const searchTerm = req.query.searchUser ? '%'+req.query.searchUser.toLowerCase()+'%' : null
  const userCount = await (
    (searchTerm) ?
    User.count({where: {email: {[Op.like]: searchTerm}}}) :
    User.count()
  )
  res.tmplOpts.pageIndex = req.query.page || 1
  res.tmplOpts.pageCount = Math.ceil(userCount / 2)
  const offset = req.query.page ? (req.query.page-1) * 2 : 0
  const allUsers = await (
    (searchTerm) ?
    User.findAll({where: {email: {[Op.like]: searchTerm}}, order: [['isAdmin', 'DESC']], limit: 2, offset}) :
    User.findAll({order: [['isAdmin', 'DESC']], limit: 2, offset})
  )
  res.tmplOpts.users = allUsers.map(u => u.dataValues)
  res.tmplOpts.users.forEach(u => {
    u.createdAt = new Date(u.createdAt).toLocaleDateString()
  })
  res.tmplOpts.searchQuery = req.query.searchUser

  res.tmplOpts.activeAdminTab = filename
  tmpl.render('app/admin/' + filename + '.twig', res.tmplOpts).then(rendered => res.end(rendered))
}