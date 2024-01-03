const tmpl = requiremain('./templates')
const { ExamType } = requiremain('./db/db')

const filename = require('path').parse(__filename).name

module.exports = async (req, res) => {
  const allExamTypes = await ExamType.findAll({order: [['name', 'DESC']]})
  res.tmplOpts.examTypes = allExamTypes

  res.tmplOpts.activeAdminTab = filename
  tmpl.render('app/admin/' + filename + '.twig', res.tmplOpts).then(rendered => res.end(rendered))
}