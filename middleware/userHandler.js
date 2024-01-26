const { Op } = require('sequelize')
const pathToRegexp = require('path-to-regexp')
const { User, Award, AwardVote } = requiremain('./db/db')

module.exports = async function (req, res, next) {
  res.tmplOpts.isLoggedIn = false
  res.tmplOpts.isAuthDomainUser = false
  res.tmplOpts.user = null
  res.tmplOpts.isAdmin = false
  res.tmplOpts.currentPath = req.originalUrl
  res.tmplOpts.currentUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  if (req.session.userId) {
    req.user = await User.findByPk(req.session.userId)
    if (req.user) {
      res.tmplOpts.hasNewAward = (await Award.findAll({where: {status: Award.STATUS.PUBLISHED, votingDeadline: {[Op.gte]: new Date()}}, attributes: ['id'], include: {model: AwardVote, where: {UserId: req.user.id}, required: false}})).filter(a => a.AwardVotes.length === 0)
      res.tmplOpts.isLoggedIn = true
      res.tmplOpts.isAuthDomainUser = req.user.hasAuthorizedDomain
      res.tmplOpts.user = req.user
      res.tmplOpts.isAdmin = req.user.isAdmin
    }
  } else {
    if (!onPublicRoute(req)) {
      req.session.destroy()
      const goto = req.originalUrl != '/app/logout' ? '?goto=' + encodeURIComponent(req.originalUrl) : ''
      return res.redirect('/' + goto)
    }
    res.requireLogin = function () {
      const goto = req.originalUrl != '/app/logout' ? '?goto=' + encodeURIComponent(req.originalUrl) : ''
      return res.redirect('/' + goto)
    }
  }
  next()
}

const publicRoutes = [
  '/app/petitions/:id',
  '/app/awards/:id',
  '/app/awards/:awardid/candidates/:candidateid',
  '/app/awards/image/:filename'
].map(r => pathToRegexp(r))

function onPublicRoute(req) {
  if (!req.method === 'GET') return false
  return publicRoutes.some(r => r.exec(req.originalUrl))
}