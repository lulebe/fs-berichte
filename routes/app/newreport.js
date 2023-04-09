const tmpl = require.main.require('./templates')

const { ExamType } = require.main.require('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.examTypes = (await ExamType.findAll({attributes: ['id', 'name', 'subjectCount']})).map(d => d.dataValues)
  
  tmpl.render('app/newreport.twig', res.tmplOpts).then(rendered => res.end(rendered))
}