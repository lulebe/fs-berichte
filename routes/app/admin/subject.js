const { Op } = require('sequelize')
const tmpl = requiremain('./templates')

const { Exam, SubjectExam, Subject, Examiner, ExamLocation, ExamType } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.subjects = (await Subject.findAll({where: {id: {[Op.ne]: req.params.id}}, attributes: ['id', 'name']})).map(d => d.dataValues)

  const reports = await SubjectExam.findAll({include: [Examiner, {model: Exam, include: [ExamLocation, ExamType]}, {model: Subject, where: {id: req.params.id}}], limit: 50})
  reports.forEach(r => {
    r.readableDate = new Date(r.Exam.date).toLocaleDateString('de-DE')
  })
  res.tmplOpts.reports = reports
  res.tmplOpts.subject = await Subject.findByPk(req.params.id)
  res.tmplOpts.activeAdminTab = "subjects"
  tmpl.render('app/admin/subject.twig', res.tmplOpts).then(rendered => res.end(rendered))
}