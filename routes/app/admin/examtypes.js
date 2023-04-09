const tmpl = require.main.require('./templates')
const { ExamType } = require.main.require('./db/db')

const filename = require('path').parse(__filename).name

module.exports = async (req, res) => {
  const allExamTypes = await ExamType.findAll({order: [['name', 'DESC']]})
  res.tmplOpts.examTypes = allExamTypes.map(s => s.dataValues)
  res.tmplOpts.examTypes.forEach(s => {
    s.createdAt = new Date(s.createdAt).toLocaleDateString()
  })

  res.tmplOpts.activeAdminTab = filename
  tmpl.render('app/admin/' + filename + '.twig', res.tmplOpts).then(rendered => res.end(rendered))
}