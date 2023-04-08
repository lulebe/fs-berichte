const router = require('express').Router()
const appRouter = require('express').Router()

const { User } = require('./db/db')

module.exports = router

router.use((req, res, next) => {
  res.tmplOpts = {isLoggedIn: false}
  next()
})

router.get('/', require('./routes/index'))
router.post('/login', require('./routes/login'))
router.post('/forgotpwd', require('./routes/forgotpwd'))


router.use('/app', userHandler)
router.use('/app', appRouter)

appRouter.get('/main', require('./routes/app/main'))
appRouter.get('/logout', require('./routes/app/logout'))
//appRouter.get('/profile', require('./routes/app/profile'))
//appRouter.post('/profile', [require('./routes/app/profile_post')], require('./routes/app/profile'))
//appRouter.get('/admin', [onlyAdmin], require('./routes/app/admin'))

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