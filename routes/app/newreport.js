const tmpl = requiremain('./templates')

const { ExamType } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.examTypes = (await ExamType.findAll({attributes: ['id', 'name']})).map(d => d.dataValues)
  
  tmpl.render('app/newreport.twig', res.tmplOpts).then(rendered => res.end(rendered))
}