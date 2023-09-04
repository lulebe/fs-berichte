const tmpl = requiremain('./templates')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

//const { Exam, SubjectExam, ExamType, Subject, Examiner, ExamLocation } = requiremain('./db/db')

module.exports = async (req, res) => {
  tmpl.render('app/mainresearch.twig', res.tmplOpts).then(rendered => res.end(rendered))
}