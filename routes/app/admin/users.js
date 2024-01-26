const { Op } = require('sequelize')

const tmpl = requiremain('./templates')
const { User } = requiremain('./db/db')

const filename = require('path').parse(__filename).name

module.exports = async (req, res) => {
  const searchTerm = req.query.searchUser ? '%'+req.query.searchUser.toLowerCase().trim()+'%' : null
  const userCount = await (
    (searchTerm) ?
    User.count({where: {[Op.or]: {email: {[Op.like]: searchTerm}, nickname: {[Op.like]: searchTerm}}}}) :
    User.count()
  )
  res.tmplOpts.pageIndex = parseInt(req.query.page) || 1
  res.tmplOpts.pageCount = Math.ceil(userCount / 50)
  const offset = req.query.page ? (req.query.page-1) * 50 : 0
  const allUsers = await (
    (searchTerm) ?
    User.findAll({where: {[Op.or]: {email: {[Op.like]: searchTerm}, nickname: {[Op.like]: searchTerm}}}, order: [['isAdmin', 'DESC'], ['id', 'DESC']], limit: 50, offset}) :
    User.findAll({order: [['isAdmin', 'DESC'], ['id', 'DESC']], limit: 50, offset})
  )
  res.tmplOpts.users = allUsers
  res.tmplOpts.searchQuery = req.query.searchUser

  res.tmplOpts.activeAdminTab = filename
  tmpl.render('app/admin/' + filename + '.twig', res.tmplOpts).then(rendered => res.end(rendered))
}