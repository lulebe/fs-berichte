const jwt = require('jsonwebtoken')

const { User, Settings } = requiremain('./db/db')

module.exports = async (req, res) => {
  if (!req.query.token) return res.status(400).send()
  const tokenData = jwt.verify(req.query.token, await Settings.get(Settings.KEYS.JWT_SECRET))
  const user = await User.findByPk(tokenData.userId)
  if (!user) return res.status(404).send()
  user.activated = true
  await user.save()
  res.redirect('/?status=7' + (req.query.goto ? '&goto=' + req.query.goto : ''))
}