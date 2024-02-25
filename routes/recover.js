const verifyJWT = require('util').promisify(require('jsonwebtoken').verify)

const { User, Settings } = requiremain('./db/db')

module.exports = async (req, res) => {
  if (!req.query.token) return res.status(400).send()
  let tokenData = null
  try {
    tokenData = await verifyJWT(req.query.token, await Settings.get(Settings.KEYS.JWT_SECRET))
  } catch (err) {
    return res.status(400).send()
  }
  const user = await User.findByPk(tokenData.id)
  if (!user) return res.status(404).send()
  if (user.password != tokenData.password) return res.status(403).send()
  if (await user.hasAuthorizedDomain() && await user.activeUntil() < new Date().setFullYear(new Date().getFullYear() + 1)) {
    user.extendedUntil = new Date().setFullYear(new Date().getFullYear() + 1)
    await user.save()
  }
  req.session.userId = user.id
  res.redirect('/app/profile')
}