const { Op } = require('sequelize')

const tmpl = requiremain('./templates')
const { User, Settings } = requiremain('./db/db')

const filename = require('path').parse(__filename).name

module.exports = async (req, res) => {
  const userSearchTerm = req.query.searchUser ? '%'+req.query.searchUser.toLowerCase().trim()+'%' : null
  const userSearchSql = userSearchTerm ? {[Op.or]: [{email: {[Op.like]: userSearchTerm}}, {nickname: {[Op.like]: userSearchTerm}}]} : {}
  const onlyExternalSql = req.query.onlyExternal ? {email: {[Op.notLike]: '%'+(await Settings.get(Settings.KEYS.AUTHORIZED_DOMAIN))}} : {}
  const where = {[Op.and]: [userSearchSql, onlyExternalSql]}
  const userCount = await User.count({where})
  res.tmplOpts.pageIndex = parseInt(req.query.page) || 1
  res.tmplOpts.pageCount = Math.ceil(userCount / 50)
  const offset = req.query.page ? (req.query.page-1) * 50 : 0
  const allUsers = await User.findAll({where, order: [['isAdmin', 'DESC'], ['id', 'DESC']], limit: 50, offset})
  res.tmplOpts.users = allUsers
  res.tmplOpts.searchQuery = req.query.searchUser
  res.tmplOpts.onlyExternalShown = req.query.onlyExternal

  res.tmplOpts.activeAdminTab = filename
  tmpl.render('app/admin/' + filename + '.twig', res.tmplOpts).then(rendered => res.end(rendered))
}