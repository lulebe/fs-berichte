const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config')
const { User, Settings } = requiremain('./db/db')
const mailer = requiremain('./email')

module.exports = async (req, res) => {
  const tokenData = jwt.verify(req.query.t, await Settings.get(Settings.KEYS.JWT_SECRET))
  
  const extendedUntil = new Date()
  extendedUntil.setFullYear(extendedUntil.getFullYear() + parseInt(tokenData.d))

  //create user
  const user = await User.create({
    email: req.body.email,
    authorized: true,
    password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(config.SALT_ROUNDS)),
    isReportsUser: !!tokenData.r,
    isFormsUser: !!tokenData.f,
    isPetitionsUser: !!tokenData.p,
    isAwardsUser: !!tokenData.a,
    extendedUntil
  })
  sendActivationEmail(user)
  res.redirect('/?status=6')
}

async function sendActivationEmail (user) {
  const ROOT_URL = await Settings.get(Settings.KEYS.ROOT_URL)
  const token = jwt.sign({userId: user.id}, await Settings.get(Settings.KEYS.JWT_SECRET), { expiresIn: '180 days' })
  return mailer(
    user.email,
    'Aktivierungslink',
    'Ihr neuer FSmed Lehre Account kann hier aktiviert werden:\n\n' + ROOT_URL + '/activate?token='+token,
    'Ihr neuer FSmed Lehre Account kann hier aktiviert werden:<br><a href="' + ROOT_URL + '/activate?token='+token + '">' + ROOT_URL + '/activate?token='+token + '</a>'
  )
}