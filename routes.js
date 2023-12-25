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

appRouter.use((req, res, next) => {
  res.tmplOpts.sidebarSelectedUrl = req.url
  next()
})

appRouter.use('/admin', require('./middleware/onlyAdmin'))
appRouter.use('/admin', adminRouter)


//user stuff
appRouter.get('/logout', require('./routes/app/logout'))
appRouter.get('/profile', require('./routes/app/profile'))
appRouter.post('/profile', [require('./routes/app/profile_post')], require('./routes/app/profile'))
appRouter.post('/deleteAccount', require('./routes/app/deleteAccount'))

//research area
appRouter.get('/research', require('./routes/app/mainresearch'))
appRouter.get('/newreport/promotion', require('./routes/app/newreport_prom'))
appRouter.post('/newreport/promotion', require('./routes/app/newreport_prom_post'))
appRouter.get('/research/:id', require('./routes/app/research'))
appRouter.post('/research/:id/delete', require('./routes/app/deleteResearch'))

//exams area
appRouter.get('/exam', require('./routes/app/main'))
appRouter.get('/exam/:id', require('./routes/app/exam'))
appRouter.get('/exam/:id/pdf', require('./routes/app/pdfsingle'))
appRouter.get('/pdfmulti', require('./routes/app/pdfmulti'))
appRouter.get('/exam/:id/edit', require('./routes/app/examedit'))
appRouter.post('/exam/:id/edit', require('./routes/app/examedit_post'))
appRouter.post('/exam/:id/delete', require('./routes/app/deleteReport'))
appRouter.get('/newreport', require('./routes/app/newreport'))
appRouter.get('/newreport/:examType', require('./routes/app/newreport2'))
appRouter.post('/newreport/:examType', require('./routes/app/newreport_post'))

//petitions area
appRouter.get('/petitions')
appRouter.get('/petitions/new')
appRouter.post('petitions/new')
appRouter.get('/petitions/:id')
appRouter.get('/petitions/:id/edit')
appRouter.post('/petitions/:id/edit')
appRouter.get('/petitions/:id/delete')
appRouter.post('/petitions/:id/comments')
appRouter.get('/petitions/:id/comments/:id/delete')

//admin area
adminRouter.use(require('./middleware/admin/quickSettings'))
adminRouter.get('/users', require('./routes/app/admin/users'))
adminRouter.get('/user/:id', require('./routes/app/admin/user'))
adminRouter.post('/user/:id', [require('./routes/app/admin/user_post')], require('./routes/app/admin/user'))
adminRouter.get('/examiners', require('./routes/app/admin/examiners'))
adminRouter.get('/examiner/:id', require('./routes/app/admin/examiner'))
adminRouter.post('/examiner/:id', require('./routes/app/admin/examiner_post'))
adminRouter.get('/examLocations', require('./routes/app/admin/locations'))
adminRouter.get('/examLocation/:id', require('./routes/app/admin/location'))
adminRouter.post('/examLocation/:id', require('./routes/app/admin/location_post'))
adminRouter.get('/examSubjects', require('./routes/app/admin/subjects'))
adminRouter.get('/examSubject/:id', require('./routes/app/admin/subject'))
adminRouter.post('/examSubject/:id', require('./routes/app/admin/subject_post'))
adminRouter.get('/examtypes', require('./routes/app/admin/examtypes'))
adminRouter.get('/examtype/new', require('./routes/app/admin/createexamtype'))
adminRouter.post('/examtype/new', require('./routes/app/admin/createexamtype_post'))
adminRouter.get('/examtype/:id', require('./routes/app/admin/examtype'))
adminRouter.post('/examtype/:id', require('./routes/app/admin/examtype_post'))
adminRouter.get('/petitions')