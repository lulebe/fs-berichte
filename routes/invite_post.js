const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config')
const { User } = requiremain('./db/db')
const mailer = requiremain('./email')

module.exports = async (req, res) => {
  const tokenData = jwt.verify(req.query.t, config.JWT_SECRET)
  
  const extendedUntil = new Date()
  extendedUntil.setFullYear(extendedUntil.getFullYear() + parseInt(tokenData.d))

  //create user
  const user = await User.create({
    email: req.body.email,
    authorized: true,
    password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(config.SALT_ROUNDS)),
    isReportsUser: !!tokenData.r,
    isFormsAdmin: !!tokenData.f,
    isPetitionsUser: !!tokenData.p,
    isAwardsUser: !!tokenData.a,
    extendedUntil
  })
  sendActivationEmail(user)
  res.redirect('/?status=6')
}

function sendActivationEmail (user) {
  const token = jwt.sign({userId: user.id}, config.JWT_SECRET, { expiresIn: '180 days' })
  return mailer(
    user.email,
    'Aktivierungslink',
    'Ihr neuer FSmed Lehre Account kann hier aktiviert werden:\n\n' + config.ROOT_URL + '/activate?token='+token,
    'Ihr neuer FSmed Lehre Account kann hier aktiviert werden:<br><a href="' + config.ROOT_URL + '/activate?token='+token + '">' + config.ROOT_URL + '/activate?token='+token + '</a>'
  )
}