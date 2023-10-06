const tmpl = requiremain('./templates')

const { Exam, SubjectExam, Subject, Examiner, ExamLocation, ExamType } = requiremain('./db/db')

module.exports = async (req, res) => {

  const reports = await Exam.findAll({where: {ExamTypeId: req.params.id}, include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation], limit: 50})
  reports.forEach(r => {
    r.subjects = r.SubjectExams.map(se => se.Subject.name).join(', ')
  })
  res.tmplOpts.reports = reports
  res.tmplOpts.examtype = await ExamType.findByPk(req.params.id)
  res.tmplOpts.activeAdminTab = "examtypes"
  tmpl.render('app/admin/examtype.twig', res.tmplOpts).then(rendered => res.end(rendered))
}