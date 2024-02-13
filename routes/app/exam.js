const Cookies = require('cookies')
const tmpl = requiremain('./templates')

const { Exam, ExamLocation, SubjectExam, Subject, Examiner, User } = requiremain('./db/db')

module.exports = async (req, res) => {
  const exam = await Exam.findByPk(req.params.id, {include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation, User]})
  if (!exam) return res.redirect('/app/exam')
  const cookies = new Cookies(req, res)
  let cookie = [req.params.id, ...(cookies.get('exams') ? cookies.get('exams').split(',') : [])]
  cookie = [...new Set(cookie)].slice(-5).join(',')
  cookies.set('exams', cookie, {maxAge: 50 * 24 * 60 * 60 * 1000})
  res.tmplOpts.exam = exam
  tmpl.render('app/exam.twig', res.tmplOpts).then(rendered => res.end(rendered))
}