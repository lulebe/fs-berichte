module.exports = async function (req, res, next) {
  if (req.user && (req.user.isAdmin || (await req.user.hasAuthorizedDomain()))) next()
  else res.redirect('/app/main')
}