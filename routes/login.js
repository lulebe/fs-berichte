const bcrypt = require('bcryptjs')
const signJWT = require('util').promisify(require('jsonwebtoken').sign)

const { User, Settings } = requiremain('./db/db')
const mailer = requiremain('./email')

module.exports = async (req, res) => {
  if (!req.body.email)
    return res.redirect('/?status=1')
  const foundUser = await User.findOne({where: {email: req.body.email.toLowerCase()}})
  if (!foundUser)
    return res.redirect('/?status=4')
  const result = await bcrypt.compare(req.body.password, foundUser.password)
  if (!result)
    return res.redirect('/?status=4')
  if (!foundUser.activated)
    return res.redirect('/?status=6')
  if (!foundUser.authorized)
    return res.redirect('/?status=12')
  if (!(await foundUser.stillActive()))
    if (await foundUser.hasAuthorizedDomain()) {
      sendReactivationEmail(foundUser)
      return res.redirect('/?status=10')
    } else
      return res.redirect('/?status=11')
  req.session.userId = foundUser.id
  if (foundUser.isAdmin) autoExtendValidityForAdmins(foundUser)
  if (req.query.goto)
    res.redirect(req.query.goto)
  else
    res.redirect('/app/main')
}

async function sendReactivationEmail (user) {
  const ROOT_URL = await Settings.get(Settings.KEYS.ROOT_URL)
  const jwt = await signJWT({id: user.id, password: user.password}, await Settings.get(Settings.KEYS.JWT_SECRET), {expiresIn: '7 days'})
  const url = `${ROOT_URL}/recover?token=${jwt}`
  return mailer(
    user.email,
    'Account reaktivieren',
    `Um deinen FSmed Lehre Account für ein Jahr zu verlängern, klicke hier:\n\n${url}`,
    `Um deinen FSmed Lehre Account für ein Jahr zu verlängern, klicke hier:<br><br><a href="${url}">${url}</a>`
  )
}

async function autoExtendValidityForAdmins (usr) {
  if (await usr.activeUntil() < new Date().setFullYear(new Date().getFullYear() + 1)) {
    usr.extendedUntil = new Date().setFullYear(new Date().getFullYear() + 1)
    await usr.save()
  }
}