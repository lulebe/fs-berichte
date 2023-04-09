const router = require('express').Router()
const appRouter = require('express').Router()
const adminRouter = require('express').Router()

const { User } = require('./db/db')

module.exports = router

router.use((req, res, next) => {
  res.tmplOpts = {isLoggedIn: false}
  next()
})

router.get('/', require('./routes/index'))
router.get('/nonAuthorizedEmail', require('./routes/nonauthmail'))
router.get('/activate', require('./routes/activate'))
router.post('/login', require('./routes/login'))
router.post('/register', require('./routes/register'))
router.post('/forgotpwd', require('./routes/forgotpwd'))


router.use('/app', require('./middleware/userHandler'))
router.use('/app', appRouter)

appRouter.use('/admin', require('./middleware/onlyAdmin'))
appRouter.use('/admin', adminRouter)

appRouter.get('/main', require('./routes/app/main'))
appRouter.get('/logout', require('./routes/app/logout'))
//appRouter.get('/profile', require('./routes/app/profile'))
//appRouter.post('/profile', [require('./routes/app/profile_post')], require('./routes/app/profile'))

adminRouter.use(require('./middleware/admin/pendingAuths'))
adminRouter.get('/users', require('./routes/app/admin/users'))
adminRouter.get('/examiners', require('./routes/app/admin/examiners'))
adminRouter.get('/examtypes', require('./routes/app/admin/examtypes'))
adminRouter.get('/createexamtype', require('./routes/app/admin/createexamtype'))
adminRouter.post('/createexamtype', require('./routes/app/admin/createexamtype_post'))
adminRouter.get('/locations', require('./routes/app/admin/locations'))
adminRouter.get('/subjects', require('./routes/app/admin/subjects'))