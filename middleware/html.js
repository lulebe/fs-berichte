module.exports = async function (req, res, next) {
    res.set('Content-Type', 'text/html')
    next()
  }