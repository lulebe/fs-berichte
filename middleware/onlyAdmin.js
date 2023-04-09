module.exports = async function (req, res, next) {
  if (req.user.isAdmin) next()
  else res.status(403).send()
}