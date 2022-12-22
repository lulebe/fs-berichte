const router = require('express').Router()
const appRouter = require('express').Router()

const { User } = require('./db')

module.exports = router

router.use((req, res, next) => {
  res.tmplOpts = {isLoggedIn: false}
  next()
})

router.get('/', require('./routes/index'))


router.use('/app', userHandler)
router.use('/app', appRouter)

//app Routes


async function userHandler (req, res, next) {
  if (!req.session.userId) {
    const goto = req.originalUrl != '/app/logout' ? '?goto=' + req.originalUrl : ''
    return res.redirect('/' + goto)
  }
  res.tmplOpts.isLoggedIn = true
  req.user = await User.findByPk(req.session.userId)
  res.tmplOpts.user = req.user.dataValues
  next()
}

async function onlyAdmin (req, res, next) {
  if (req.user.isAdmin) next()
  else res.status(403).send()
}