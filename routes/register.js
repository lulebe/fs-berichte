const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config')
const { User } = requiremain('./db/db')
const mailer = requiremain('./email')

module.exports = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.repeatPassword)
    return res.redirect('/?status=1')
  if (req.body.repeatPassword !== req.body.password)
    return res.redirect('/?status=3')
  const foundUser = await User.findOne({where: {email: req.body.email.toLowerCase()}})
  if (foundUser && foundUser.activated)
    return res.redirect('/?status=5')
  else if (foundUser && !foundUser.activated && foundUser.authorized) {
    sendActivationEmail(req.body.email)
    return res.redirect('/?status=6')
  }
  

  const userIsAuthorizedDomain = req.body.email.endsWith('@' + config.AUTHORIZED_DOMAIN)
  if (userIsAuthorizedDomain) {
    const user = await User.create({
      email: req.body.email,
      authorized: userIsAuthorizedDomain,
      password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(config.SALT_ROUNDS))
    })
    sendActivationEmail(user)
    res.redirect('/?status=6')
  } else {
    if (!req.body.reason) {
      return res.redirect('/?status=8')
    }
    //create user
    const user = await User.create({
      email: req.body.email,
      authorized: userIsAuthorizedDomain,
      authReason: req.body.reason,
      password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(config.SALT_ROUNDS))
    })
    //send admin email
    sendAdminEmail (user, req.body.reason)
    return res.redirect('/?status=9')
  }
}

function sendActivationEmail (user) {
  const token = jwt.sign({userId: user.id}, config.JWT_SECRET, { expiresIn: '24h' })
  return mailer(
    user.email,
    'Aktivierungslink',
    'Dein neuer FSmed Berichte Account kann hier aktiviert werden:\n\n' + config.ROOT_URL + '/activate?token='+token,
    'Dein neuer FSmed Berichte Account kann hier aktiviert werden:<br><a href="' + config.ROOT_URL + '/activate?token='+token + '">' + config.ROOT_URL + '/activate?token='+token + '</a>'
  )
}

function sendAdminEmail (user, reason) {
  return mailer(
    config.ADMIN_EMAIL,
    'Berichte Freischaltungsanfrage',
    'Der Nutzer ' + user.email + ' bittet um Freischaltung mit folgender Begründung:\n\n' + reason + '\n\n Er kann unter ' + config.ROOT_URL + '/app/admin/users freigeschaltet werden.',
    'Der Nutzer <pre>' + user.email + '</pre> bittet um Freischaltung mit folgender Begründung:<br><br>' + reason + '<br><br> Er kann unter <a href="' + config.ROOT_URL + '/app/admin/users">' + config.ROOT_URL + '/app/admin/users</a> freigeschaltet werden.'
  )
}