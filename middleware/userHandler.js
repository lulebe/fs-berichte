const { User, Award, AwardVote } = requiremain('./db/db')

module.exports = async function (req, res, next) {
  if (!req.session.userId) {
    const goto = req.originalUrl != '/app/logout' ? '?goto=' + encodeURIComponent(req.originalUrl) : ''
    return res.redirect('/' + goto)
  }
  req.user = await User.findByPk(req.session.userId)
  if (!req.user) {
    req.session.destroy()
    return res.redirect('/')
  }
  res.tmplOpts.hasNewAward = (await Award.findAll({where: {status: Award.STATUS.PUBLISHED}, attributes: ['id'], include: {model: AwardVote, where: {UserId: req.user.id}, required: false}})).filter(a => a.AwardVotes.length === 0)
  res.tmplOpts.isLoggedIn = true
  res.tmplOpts.user = req.user
  res.tmplOpts.isAdmin = req.user.isAdmin
  next()
}