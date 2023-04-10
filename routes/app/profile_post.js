const bcrypt = require('bcryptjs')

const config = requiremain('./config')

module.exports = async (req, res, next) => {
  if (req.body.newpw != req.body.repeatpw) return res.status(400).send()
  const oldMatches = await bcrypt.compare(req.body.oldpw, req.user.password)
  if (!oldMatches) return res.status(401).send()
  req.user.password = await bcrypt.hash(req.body.newpw, await bcrypt.genSalt(config.SALT_ROUNDS))
  await req.user.save()
  res.tmplOpts.pwChanged = true
  next()
}