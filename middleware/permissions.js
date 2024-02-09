module.exports = function (filter) {
  return async function (req, res, next) {
    if (req.user && filter(req.user)) next()
    else res.redirect('/app/main')
  }
}