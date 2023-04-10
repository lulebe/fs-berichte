const tmpl = requiremain('./templates')
const Sequelize = require('sequelize')

const { Exam, SubjectExam, ExamType, Subject, Examiner, ExamLocation } = requiremain('./db/db')

module.exports = async (req, res) => {

  //search query
  const sqlquery = {where: {UserId: req.user.id}, include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation]}
  const results = await Exam.findAll(sqlquery)
  results.forEach(r => {
    r.readableDate = new Date(r.date).toLocaleDateString('de-DE')
    r.subjects = r.SubjectExams.map(se => se.Subject.name).join(', ')
  })
  res.tmplOpts.reports = results
  tmpl.render('app/profile.twig', res.tmplOpts).then(rendered => res.end(rendered))
}