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
router.get('/activate', require('./routes/activate'))
router.post('/login', require('./routes/login'))
router.post('/register', require('./routes/register'))
router.post('/forgotpwd', require('./routes/forgotpwd'))


router.use('/app', require('./middleware/userHandler'))
router.use('/app', appRouter)

appRouter.use('/admin', require('./middleware/onlyAdmin'))
appRouter.use('/admin', adminRouter)

appRouter.get('/main', require('./routes/app/main'))
appRouter.get('/exam/:id', require('./routes/app/exam'))
appRouter.get('/exam/:id/pdf', require('./routes/app/pdfsingle'))
appRouter.get('/pdfmulti', require('./routes/app/pdfmulti'))
appRouter.get('/exam/:id/edit', require('./routes/app/examedit'))
appRouter.post('/exam/:id/edit', require('./routes/app/examedit_post'))
appRouter.post('/exam/:id/delete', require('./routes/app/deleteReport'))
appRouter.get('/newreport', require('./routes/app/newreport'))
appRouter.get('/newreport/promotion', require('./routes/app/newreport_prom'))
appRouter.post('/newreport/promotion', require('./routes/app/newreport_prom_post'))
appRouter.get('/newreport/:examType', require('./routes/app/newreport2'))
appRouter.post('/newreport/:examType', require('./routes/app/newreport_post'))
appRouter.get('/logout', require('./routes/app/logout'))
appRouter.get('/profile', require('./routes/app/profile'))
appRouter.post('/profile', [require('./routes/app/profile_post')], require('./routes/app/profile'))
appRouter.post('/deleteAccount', require('./routes/app/deleteAccount'))

//research area
appRouter.get('/mainresearch', require('./routes/app/mainresearch'))

adminRouter.use(require('./middleware/admin/pendingAuths'))
adminRouter.get('/users', require('./routes/app/admin/users'))
adminRouter.get('/user/:id', require('./routes/app/admin/user'))
adminRouter.post('/user/:id', [require('./routes/app/admin/user_post')], require('./routes/app/admin/user'))
adminRouter.get('/examiners', require('./routes/app/admin/examiners'))
adminRouter.get('/examiner/:id', require('./routes/app/admin/examiner'))
adminRouter.post('/examiner/:id', require('./routes/app/admin/examiner_post'))
adminRouter.get('/locations', require('./routes/app/admin/locations'))
adminRouter.get('/location/:id', require('./routes/app/admin/location'))
adminRouter.post('/location/:id', require('./routes/app/admin/location_post'))
adminRouter.get('/subjects', require('./routes/app/admin/subjects'))
adminRouter.get('/subject/:id', require('./routes/app/admin/subject'))
adminRouter.post('/subject/:id', require('./routes/app/admin/subject_post'))
adminRouter.get('/examtypes', require('./routes/app/admin/examtypes'))
adminRouter.get('/examtype/:id', require('./routes/app/admin/examtype'))
adminRouter.post('/examtype/:id', require('./routes/app/admin/examtype_post'))
adminRouter.get('/createexamtype', require('./routes/app/admin/createexamtype'))
adminRouter.post('/createexamtype', require('./routes/app/admin/createexamtype_post'))

adminRouter.get('/import', require('./routes/app/admin/import'))
//adminRouter.post('/import', require('./routes/app/admin/import'))