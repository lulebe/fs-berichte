const signJWT = require('util').promisify(require('jsonwebtoken').sign)

const mailer = requiremain('./email')
const { User, Settings } = requiremain('./db/db')

module.exports = async (req, res) => {
  if (!req.body.email)
    return res.redirect('/?status=1')
  const foundUser = await User.findOne({where: {email: req.body.email.toLowerCase()}})
  if (!foundUser)
    return res.redirect('/?status=4')
  await sendEmail(foundUser)
  res.redirect('/?status=2')
}

async function sendEmail (user) {
  const ROOT_URL = await Settings.get(Settings.KEYS.ROOT_URL)
  const jwt = await signJWT({id: user.id, password: user.password}, await Settings.get(Settings.KEYS.JWT_SECRET), {expiresIn: '7 days'})
  const url = `${ROOT_URL}/recover?token=${jwt}`
  return mailer(
    user.email,
    'Passwort zurückgesetzt',
    `Du kannst dich mit folgendem Link wieder in FSmed Lehre anmelden. Ändere danach dein Passwort.\n\n${url}`,
    `Du kannst dich mit folgendem Link wieder in FSmed Lehre anmelden. Ändere danach dein Passwort.<br><br><a href="${url}">${url}</a>`
  )
}