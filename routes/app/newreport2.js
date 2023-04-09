const tmpl = require.main.require('./templates')

const { ExamType, Subject, ExamLocation, Examiner } = require.main.require('./db/db')

module.exports = async (req, res) => {
  const examType = await ExamType.findByPk(req.params.examType)
  if (!examType) return res.status(404).send()
  const data = await Promise.all([
    Subject.findAll({attributes: ['id', 'name']}),
    ExamLocation.findAll({attributes: ['id', 'name']}),
    Examiner.findAll({attributes: ['id', 'name']})
  ])
  res.tmplOpts.examType = examType.dataValues
  res.tmplOpts.subjects = data[0].map(d => d.dataValues)
  res.tmplOpts.locations = data[1].map(d => d.dataValues)
  res.tmplOpts.examiners = data[2].map(d => d.dataValues)
  
  tmpl.render('app/newreport2.twig', res.tmplOpts).then(rendered => res.end(rendered))
}