const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const config = require('../config')
const { User, Settings } = requiremain('./db/db')
const mailer = requiremain('./email')

module.exports = async (req, res) => {
  const goto = req.query.goto ? '&goto=' + req.query.goto : ''
  if (!req.body.email || !req.body.password || !req.body.repeatPassword)
    return res.redirect('/?status=1' + goto)
  if (req.body.repeatPassword !== req.body.password)
    return res.redirect('/?status=3' + goto)
  const foundUser = await User.findOne({where: {email: req.body.email.toLowerCase()}})
  if (foundUser && foundUser.activated)
    return res.redirect('/?status=5' + goto)
  else if (foundUser && !foundUser.activated && foundUser.authorized) {
    sendActivationEmail(req.body.email, goto)
    return res.redirect('/?status=6' + goto)
  }
  

  const userIsAuthorizedDomain = req.body.email.toLowerCase().endsWith(await Settings.get(Settings.KEYS.AUTHORIZED_DOMAIN))
  if (userIsAuthorizedDomain) {
    const user = await User.create({
      email: req.body.email.toLowerCase(),
      nickname: req.body.nickname || null,
      authorized: true,
      password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(config.SALT_ROUNDS)),
      isReportsUser: true,
      isPetitionsUser: true,
      isFormsUser: true,
      isAwardsUser: true
    })
    sendActivationEmail(user, goto)
    res.redirect('/?status=6' + goto)
  } else {
    if (!req.body.reason) {
      return res.redirect('/?status=8' + goto)
    }
    //create user
    const user = await User.create({
      email: req.body.email,
      nickname: req.body.nickname || null,
      authorized: false,
      authReason: req.body.reason,
      password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(config.SALT_ROUNDS)),
      isReportsUser: true
    })
    //send admin email
    sendAdminEmail (user, req.body.reason)
    return res.redirect('/?status=9' + goto)
  }
}

async function sendActivationEmail (user, goto) {
  const ROOT_URL = await Settings.get(Settings.KEYS.ROOT_URL)
  const token = jwt.sign({userId: user.id}, await Settings.get(Settings.KEYS.JWT_SECRET), { expiresIn: '7 days' })
  return mailer(
    user.email,
    'Aktivierungslink',
    'Dein neuer FSmed Lehre Account kann hier aktiviert werden:\n\n' + ROOT_URL + '/activate?token='+token+goto,
    'Dein neuer FSmed Lehre Account kann hier aktiviert werden:<br><a href="' + ROOT_URL + '/activate?token='+token+goto + '">' + ROOT_URL + '/activate?token='+token + '</a>'
  )
}

async function sendAdminEmail (user, reason) {
  User.notifyWhere({[Op.or]: [{isAdmin: true}, {moderator: true}]}, 'Neuen Nutzer freischalten', user.email, '/app/admin/users')
  const ROOT_URL = await Settings.get(Settings.KEYS.ROOT_URL)
  return mailer(
    await Settings.get(Settings.KEYS.ADMIN_EMAIL),
    'Lehre Freischaltungsanfrage',
    'Der Nutzer ' + user.email + ' bittet um Freischaltung mit folgender Begründung:\n\n' + reason + '\n\n Er kann unter ' + ROOT_URL + '/app/admin/users freigeschaltet werden.',
    'Der Nutzer <pre>' + user.email + '</pre> bittet um Freischaltung mit folgender Begründung:<br><br>' + reason + '<br><br> Er kann unter <a href="' + ROOT_URL + '/app/admin/users">' + ROOT_URL + '/app/admin/users</a> freigeschaltet werden.'
  )
}