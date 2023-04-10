const { Op } = require('sequelize')
const tmpl = requiremain('./templates')

const { Exam, SubjectExam, Subject, Examiner, ExamLocation, ExamType } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.locations = (await ExamLocation.findAll({where: {id: {[Op.ne]: req.params.id}}, attributes: ['id', 'name']})).map(d => d.dataValues)

  const reports = await Exam.findAll({where: {ExamLocationId: req.params.id}, include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation], limit: 50})
  reports.forEach(r => {
    r.readableDate = new Date(r.date).toLocaleDateString('de-DE')
    r.subjects = r.SubjectExams.map(se => se.Subject.name).join(', ')
  })
  res.tmplOpts.reports = reports
  res.tmplOpts.location = await ExamLocation.findByPk(req.params.id)
  tmpl.render('app/admin/location.twig', res.tmplOpts).then(rendered => res.end(rendered))
}