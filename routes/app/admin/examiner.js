const { Op } = require('sequelize')
const tmpl = requiremain('./templates')

const { Exam, SubjectExam, Subject, Examiner, ExamLocation, ExamType } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.examiners = (await Examiner.findAll({where: {id: {[Op.ne]: req.params.id}}, attributes: ['id', 'name']})).map(d => d.dataValues)

  const reports = await SubjectExam.findAll({include: [Subject, {model: Exam, include: [ExamLocation, ExamType]}, {model: Examiner, where: {id: req.params.id}}], limit: 50})
  res.tmplOpts.reports = reports
  res.tmplOpts.examiner = await Examiner.findByPk(req.params.id)
  res.tmplOpts.activeAdminTab = "examiners"
  tmpl.render('app/admin/examiner.twig', res.tmplOpts).then(rendered => res.end(rendered))
}