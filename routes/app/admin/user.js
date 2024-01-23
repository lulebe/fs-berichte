const tmpl = requiremain('./templates')
const Sequelize = require('sequelize')

const { User, Exam, SubjectExam, Subject, Examiner, ExamLocation, ResearchReport, PetitionComment, Petition } = requiremain('./db/db')

const WORK_STRINGS = ["", "Doktorarbeit", "Praktikum", "HiWi-Job", "sonstiges"]

module.exports = async (req, res) => {

  //search query
  const sqlqueryReports = {where: {UserId: req.params.id}, include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation]}
  const results = await Exam.findAll(sqlqueryReports)
  results.forEach(r => {
    r.subjects = r.SubjectExams.map(se => se.Subject.name).join(', ')
  })
  res.tmplOpts.reports = results
  res.tmplOpts.research = await ResearchReport.findAll({where: {UserId: req.params.id}})
  res.tmplOpts.petitions = await Petition.findAll({where: {UserId: req.params.id}})
  res.tmplOpts.petitionComments = await PetitionComment.findAll({where: {UserId: req.params.id}, include: [Petition]})
  res.tmplOpts.viewedUser = await User.findByPk(req.params.id)
  res.tmplOpts.activeAdminTab = "users"
  tmpl.render('app/admin/user.twig', res.tmplOpts).then(rendered => res.end(rendered))
}