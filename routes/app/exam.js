const tmpl = require.main.require('./templates')

const { Exam, ExamLocation, SubjectExam, Subject, Examiner } = require.main.require('./db/db')

module.exports = async (req, res) => {
  const exam = await Exam.findByPk(req.params.id, {include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation]})
  res.tmplOpts.examDate = new Date(exam.date).toLocaleDateString('de-DE')
  res.tmplOpts.exam = exam
  tmpl.render('app/exam.twig', res.tmplOpts).then(rendered => res.end(rendered))
}