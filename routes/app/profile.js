const tmpl = requiremain('./templates')
const Sequelize = require('sequelize')

const { Exam, SubjectExam, ResearchReport, Subject, Examiner, ExamLocation, Petition, PetitionComment } = requiremain('./db/db')

module.exports = async (req, res) => {

  //search query
  const sqlquery = {where: {UserId: req.user.id}, include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation]}
  const results = await Exam.findAll(sqlquery)
  results.forEach(r => {
    r.subjects = r.SubjectExams.map(se => se.Subject.name).join(', ')
  })
  res.tmplOpts.user = req.user
  res.tmplOpts.hasNotificationsEnabled = (await req.user.getNotificationSubscriptions()).length > 0
  res.tmplOpts.notificationSubs = (await req.user.getNotificationSubscriptions())
  res.tmplOpts.reports = results
  res.tmplOpts.research = await ResearchReport.findAll({where: {UserId: req.user.id}})
  res.tmplOpts.petitions = await Petition.findAll({where: {UserId: req.user.id}})
  res.tmplOpts.petitionComments = await PetitionComment.findAll({where: {UserId: req.user.id}, include: [Petition]})
  res.tmplOpts.noContent = res.tmplOpts.research.length === 0 && res.tmplOpts.reports.length === 0 && res.tmplOpts.petitions.length === 0 && res.tmplOpts.petitionComments.length === 0
  tmpl.render('app/profile.twig', res.tmplOpts).then(rendered => res.end(rendered))
}