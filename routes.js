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

appRouter.get('/main', require('./routes/app/main'))

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
appRouter.get('/exam', require('./routes/app/mainexam'))
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
appRouter.get('/petitions', require('./routes/app/petitions/petitions'))
appRouter.get('/petitions/new', require('./routes/app/petitions/new'))
appRouter.post('/petitions/new', require('./routes/app/petitions/new_post'))
appRouter.get('/petitions/:id', require('./routes/app/petitions/petition'))
appRouter.post('/petitions/:id', [require('./routes/app/petitions/petition_post')], require('./routes/app/petitions/petition'))
appRouter.get('/petitions/:id/edit', require('./routes/app/petitions/edit'))
appRouter.post('/petitions/:id/edit', require('./routes/app/petitions/edit_post'))

//forms area
appRouter.get('/forms', require('./routes/app/forms'))
appRouter.get('/forms/:id', require('./routes/app/form'))

//awards area
appRouter.get('/awards', require('./routes/app/awards/awards'))
appRouter.get('/awards/:id', require('./routes/app/awards/award'))
appRouter.get('/awards/:awardid/candidates/:candidateid', require('./routes/app/awards/candidate'))
appRouter.get('/awards/:awardid/candidates/:candidateid/vote', require('./routes/app/awards/castvote'))
appRouter.get('/awards/image/:filename', require('./routes/app/awards/image_get'))

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
adminRouter.get('/petitions', require('./routes/app/admin/petitions'))
adminRouter.post('/petitions', [require('./routes/app/admin/petitions_post')], require('./routes/app/admin/petitions'))
adminRouter.get('/forms', require('./routes/app/admin/forms'))
adminRouter.post('/forms', [require('./routes/app/admin/forms_post')], require('./routes/app/admin/forms'))
//admin awards
adminRouter.get('/awards', require('./routes/app/admin/awards/awards'))
adminRouter.post('/awards', [require('./routes/app/admin/awards/awards_post')], require('./routes/app/admin/awards/awards'))
adminRouter.get('/awards/new', require('./routes/app/admin/awards/new'))
adminRouter.post('/awards/new', require('./routes/app/admin/awards/new_post'))
adminRouter.get('/awards/:id', require('./routes/app/admin/awards/award'))
adminRouter.put('/awards/:id', require('./routes/app/admin/awards/edit'))
adminRouter.delete('/awards/:id', require('./routes/app/admin/awards/delete'))
adminRouter.get('/awards/:awardid/candidates/new', require('./routes/app/admin/awards/newcandidate'))
adminRouter.post('/awards/:awardid/candidates/new', require('./routes/app/admin/awards/newcandidate_post'))
adminRouter.get('/awards/:awardid/candidates/:candidateid', require('./routes/app/admin/awards/candidate'))
adminRouter.put('/awards/:awardid/candidates/:candidateid', require('./routes/app/admin/awards/candidate_update'))
adminRouter.get('/awards/:awardid/candidates/:candidateid/delete', require('./routes/app/admin/awards/candidate_delete'))
adminRouter.post('/awards/:awardid/candidates/:candidateid/images', require('./routes/app/admin/awards/image_upload'))
adminRouter.delete('/awards/images/:id', require('./routes/app/admin/awards/image_delete'))