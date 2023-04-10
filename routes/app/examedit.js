const tmpl = requiremain('./templates')

const { Exam, User, SubjectExam, ExamType, Subject, ExamLocation, Examiner } = requiremain('./db/db')

module.exports = async (req, res) => {
  const exam = await Exam.findByPk(req.params.id, {include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation, User, ExamType]})
  if (!exam) return res.status(404).send()
  const data = await Promise.all([
    Subject.findAll({attributes: ['id', 'name']}),
    ExamLocation.findAll({attributes: ['id', 'name']}),
    Examiner.findAll({attributes: ['id', 'name']})
  ])
  res.tmplOpts.exam = exam
  res.tmplOpts.inputformatdate = new Date(exam.date).toISOString().substr(0, 10)
  res.tmplOpts.subjects = data[0].map(d => d.dataValues)
  res.tmplOpts.locations = data[1].map(d => d.dataValues)
  res.tmplOpts.examiners = data[2].map(d => d.dataValues)
  
  tmpl.render('app/examedit.twig', res.tmplOpts).then(rendered => res.end(rendered))
}