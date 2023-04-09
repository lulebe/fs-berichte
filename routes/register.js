const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config')
const { User } = require.main.require('./db/db')
const mailer = require.main.require('./email')

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
  const user = await User.create({
    email: req.body.email,
    authorized: userIsAuthorizedDomain,
    password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(config.SALT_ROUNDS))
  })
  if (userIsAuthorizedDomain) {
    sendActivationEmail(req.body.email)
    res.redirect('/?status=6')
  } else {
    //show notification to contact for authorization
    res.redirect('/nonAuthorizedEmail?email='+encodeURIComponent(req.body.email))
  }
}

function sendActivationEmail (email) {
  const token = jwt.sign({data: email}, config.JWT_SECRET, { expiresIn: '24h' })
  //TODO: remove
  console.log(config.ROOT_URL + '/activate?token='+token)
  return mailer(
    [{email, name: ""}],
    'Aktivierungslink',
    'Dein neuer FSmed Berichte Account kann hier aktiviert werden:\n\n' + config.ROOT_URL + '/activate?token='+token,
    'Dein neuer FSmed Berichte Account kann hier aktiviert werden:<br><a href="' + config.ROOT_URL + '/activate?token='+token + '">' + config.ROOT_URL + '/activate?token='+token + '</a>'
  )
}