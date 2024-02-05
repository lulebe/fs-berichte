const bcrypt = require('bcryptjs')
const generator = require('generate-password')
const signJWT = require('util').promisify(require('jsonwebtoken').sign)

const mailer = requiremain('./email')
const config = requiremain('./config')
const { User } = requiremain('./db/db')

module.exports = async (req, res) => {
  if (!req.body.email)
    return res.redirect('/?status=1')
  const foundUser = await User.findOne({where: {email: req.body.email.toLowerCase()}})
  if (!foundUser)
    return res.redirect('/?status=4')
  return res.status(200).send(await sendEmail(foundUser))
  res.redirect('/?status=2')
}

async function sendEmail (user) {
  const jwt = await signJWT({id: user.id, password: user.password}, config.JWT_SECRET, {expiresIn: '3 days'})
  const url = `${config.ROOT_URL}/recover?token=${jwt}`
  return mailer(
    user.email,
    'Passwort zurückgesetzt',
    `Du kannst dich mit folgendem Link wieder in FSmed Lehre anmelden. Ändere danach dein Passwort.\n\n${url}`,
    `Du kannst dich mit folgendem Link wieder in FSmed Lehre anmelden. Ändere danach dein Passwort.<br><br><a href="${url}">${url}</a>`
  )
}