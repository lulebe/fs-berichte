const path = require('path')
const router = require('express').Router()
const appRouter = require('express').Router()
const adminRouter = require('express').Router()

const perms = require('./middleware/permissions')

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
router.get('/recover', require('./routes/recover'))
router.get('/invite', require('./routes/invite'))
router.post('/invite', require('./routes/invite_post'))

router.get('/sw.js', (req, res) => res.sendFile(path.resolve(__dirname, './assets/sw.js')))

router.use('/app', require('./middleware/userHandler'))
router.use('/app', appRouter)

appRouter.use((req, res, next) => {
  res.tmplOpts.sidebarSelectedUrl = req.url
  next()
})

appRouter.use('/admin', adminRouter)

appRouter.get('/main', require('./routes/app/main'))

//random api stuff
appRouter.post('/api/registerPush', require('./routes/app/api/registerPush'))

//user stuff
appRouter.get('/logout', require('./routes/app/logout'))
appRouter.get('/profile', require('./routes/app/profile'))
appRouter.post('/profile', [require('./routes/app/profile_post')], require('./routes/app/profile'))
appRouter.post('/deleteAccount', require('./routes/app/deleteAccount'))

//research area
appRouter.get('/research', [perms(u=>u.isReportsUser)], require('./routes/app/mainresearch'))
appRouter.get('/newreport/promotion', [perms(u=>u.isReportsUser)], require('./routes/app/newreport_prom'))
appRouter.post('/newreport/promotion', [perms(u=>u.isReportsUser)], require('./routes/app/newreport_prom_post'))
appRouter.get('/research/:id', [perms(u=>u.isReportsUser)], require('./routes/app/research'))
appRouter.post('/research/:id/delete', [perms(u=>u.isReportsUser)], require('./routes/app/deleteResearch'))

//exams area
appRouter.get('/exam', [perms(u=>u.isReportsUser)], require('./routes/app/mainexam'))
appRouter.get('/exam/:id', [perms(u=>u.isReportsUser)], require('./routes/app/exam'))
appRouter.get('/exam/:id/pdf', [perms(u=>u.isReportsUser)], require('./routes/app/pdfsingle'))
appRouter.get('/pdfmulti', [perms(u=>u.isReportsUser)], require('./routes/app/pdfmulti'))
appRouter.get('/exam/:id/edit', [perms(u=>u.isReportsUser)], require('./routes/app/examedit'))
appRouter.post('/exam/:id/edit', [perms(u=>u.isReportsUser)], require('./routes/app/examedit_post'))
appRouter.post('/exam/:id/delete', [perms(u=>u.isReportsUser)], require('./routes/app/deleteReport'))
appRouter.get('/newreport', [perms(u=>u.isReportsUser)], require('./routes/app/newreport'))
appRouter.get('/newreport/:examType', [perms(u=>u.isReportsUser)], require('./routes/app/newreport2'))
appRouter.post('/newreport/:examType', [perms(u=>u.isReportsUser)], require('./routes/app/newreport_post'))

//petitions area
appRouter.get('/petitions', [perms(u=>u.isPetitionsUser)],require('./routes/app/petitions/petitions'))
appRouter.get('/petitions/new', [perms(u=>u.isPetitionsUser)], require('./routes/app/petitions/new'))
appRouter.post('/petitions/new', [perms(u=>u.isPetitionsUser)], require('./routes/app/petitions/new_post'))
appRouter.get('/petitions/:id', require('./routes/app/petitions/petition'))
appRouter.post('/petitions/:id', [perms(u=>u.isPetitionsUser)], require('./routes/app/petitions/petition_post'))
appRouter.get('/petitions/:id/edit', [perms(u=>u.isPetitionsUser)], require('./routes/app/petitions/edit'))
appRouter.post('/petitions/:id/edit', [perms(u=>u.isPetitionsUser)], require('./routes/app/petitions/edit_post'))

//forms area
appRouter.get('/forms', [perms(u=>u.isFormsUser)], require('./routes/app/forms'))
appRouter.get('/forms/:id', [perms(u=>u.isFormsUser)], require('./routes/app/form'))

//awards area
appRouter.get('/awards', [perms(u=>u.isAwardsUser)], require('./routes/app/awards/awards'))
appRouter.get('/awards/:id', require('./routes/app/awards/award'))
appRouter.get('/awards/:awardid/candidates/:candidateid', require('./routes/app/awards/candidate'))
appRouter.get('/awards/:awardid/candidates/:candidateid/vote', [perms(u=>u.isAwardsUser)], require('./routes/app/awards/castvote'))
appRouter.get('/awards/image/:filename', require('./routes/app/awards/image_get'))

//admin area
adminRouter.use(require('./middleware/admin/quickSettings'))
adminRouter.get('/settings', [perms(u=>u.isAnyAdmin)], require('./routes/app/admin/settings'))
adminRouter.post('/settings', [perms(u=>u.isAnyAdmin)], require('./routes/app/admin/settings_post'))
adminRouter.get('/users', [perms(u=>u.isAnyAdmin)], require('./routes/app/admin/users'))
adminRouter.post('/users', [perms(u=>u.isModerator)], require('./routes/app/admin/users'))
adminRouter.get('/users/invite', [perms(u=>u.isAdmin)], require('./routes/app/admin/users_invite'))
adminRouter.get('/user/:id', [perms(u=>u.isAnyAdmin)], require('./routes/app/admin/user'))
adminRouter.post('/user/:id', [perms(u=>u.isAdmin)], [require('./routes/app/admin/user_post')], require('./routes/app/admin/user'))
adminRouter.get('/examiners', [perms(u=>u.isModerator)], require('./routes/app/admin/examiners'))
adminRouter.get('/examiner/:id', [perms(u=>u.isModerator)], require('./routes/app/admin/examiner'))
adminRouter.post('/examiner/:id', [perms(u=>u.isModerator)], require('./routes/app/admin/examiner_post'))
adminRouter.get('/examLocations', [perms(u=>u.isModerator)], require('./routes/app/admin/locations'))
adminRouter.get('/examLocation/:id', [perms(u=>u.isModerator)], require('./routes/app/admin/location'))
adminRouter.post('/examLocation/:id', [perms(u=>u.isModerator)], require('./routes/app/admin/location_post'))
adminRouter.get('/examSubjects', [perms(u=>u.isModerator)], require('./routes/app/admin/subjects'))
adminRouter.get('/examSubject/:id', [perms(u=>u.isModerator)], require('./routes/app/admin/subject'))
adminRouter.post('/examSubject/:id', [perms(u=>u.isModerator)], require('./routes/app/admin/subject_post'))
adminRouter.get('/examtypes', [perms(u=>u.isModerator)], require('./routes/app/admin/examtypes'))
adminRouter.get('/examtype/new', [perms(u=>u.isModerator)], require('./routes/app/admin/createexamtype'))
adminRouter.post('/examtype/new', [perms(u=>u.isModerator)], require('./routes/app/admin/createexamtype_post'))
adminRouter.get('/examtype/:id', [perms(u=>u.isModerator)], require('./routes/app/admin/examtype'))
adminRouter.post('/examtype/:id', [perms(u=>u.isModerator)], require('./routes/app/admin/examtype_post'))
adminRouter.get('/petitions', [perms(u=>u.isPetitionsAdmin)], require('./routes/app/admin/petitions'))
adminRouter.post('/petitions', [perms(u=>u.isPetitionsAdmin)], [require('./routes/app/admin/petitions_post')], require('./routes/app/admin/petitions'))
adminRouter.get('/forms', [perms(u=>u.isFormsAdmin)], require('./routes/app/admin/forms'))
adminRouter.post('/forms', [perms(u=>u.isFormsAdmin)], [require('./routes/app/admin/forms_post')], require('./routes/app/admin/forms'))
//admin awards
adminRouter.get('/awards', [perms(u=>u.isAwardsAdmin)], require('./routes/app/admin/awards/awards'))
adminRouter.post('/awards', [perms(u=>u.isAwardsAdmin)], [require('./routes/app/admin/awards/awards_post')], require('./routes/app/admin/awards/awards'))
adminRouter.get('/awards/new', [perms(u=>u.isAwardsAdmin)], require('./routes/app/admin/awards/new'))
adminRouter.post('/awards/new', [perms(u=>u.isAwardsAdmin)], require('./routes/app/admin/awards/new_post'))
adminRouter.get('/awards/:id', [perms(u=>u.isAwardsAdmin)], require('./routes/app/admin/awards/award'))
adminRouter.put('/awards/:id', [perms(u=>u.isAwardsAdmin)], require('./routes/app/admin/awards/edit'))
adminRouter.delete('/awards/:id', [perms(u=>u.isAwardsAdmin)], require('./routes/app/admin/awards/delete'))
adminRouter.get('/awards/:id/randomVoter', [perms(u=>u.isAwardsAdmin)], require('./routes/app/admin/awards/random_voter'))
adminRouter.get('/awards/:awardid/candidates/new', [perms(u=>u.isAwardsAdmin)], require('./routes/app/admin/awards/newcandidate'))
adminRouter.post('/awards/:awardid/candidates/new', [perms(u=>u.isAwardsAdmin)], require('./routes/app/admin/awards/newcandidate_post'))
adminRouter.get('/awards/:awardid/candidates/:candidateid', [perms(u=>u.isAwardsAdmin)], require('./routes/app/admin/awards/candidate'))
adminRouter.put('/awards/:awardid/candidates/:candidateid', [perms(u=>u.isAwardsAdmin)], require('./routes/app/admin/awards/candidate_update'))
adminRouter.get('/awards/:awardid/candidates/:candidateid/delete', [perms(u=>u.isAwardsAdmin)], require('./routes/app/admin/awards/candidate_delete'))
adminRouter.post('/awards/:awardid/candidates/:candidateid/images', [perms(u=>u.isAwardsAdmin)], require('./routes/app/admin/awards/image_upload'))
adminRouter.delete('/awards/images/:id', [perms(u=>u.isAwardsAdmin)], require('./routes/app/admin/awards/image_delete'))