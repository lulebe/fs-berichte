const tmpl = require.main.require('./templates')
const Sequelize = require('sequelize')

const { Exam, SubjectExam, ExamType, Subject, Examiner, ExamLocation } = require.main.require('./db/db')

module.exports = async (req, res) => {
  //search autocomplete Date
  const data = await Promise.all([
    Subject.findAll({attributes: ['id', 'name']}),
    ExamLocation.findAll({attributes: ['id', 'name']}),
    Examiner.findAll({attributes: ['id', 'name']}),
    ExamType.findAll({attributes: ['id', 'name']})
  ])
  res.tmplOpts.subjects = data[0].map(d => d.dataValues)
  res.tmplOpts.locations = data[1].map(d => d.dataValues)
  res.tmplOpts.examiners = data[2].map(d => d.dataValues)
  res.tmplOpts.examTypes = data[3].map(d => d.dataValues)

  //search query
  const sqlquery = {include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation]}
  if (req.query.locationId) {
    sqlquery.where = {ExamLocationId: parseInt(req.query.locationId)}
  } else if (req.query.location) {
    sqlquery.include[1] = {model: ExamLocation, where: {name: {[Op.like]: '%'+req.query.location+'%'}}}
  }
  if (req.query.examType > 0) {
    if (!sqlquery.where) sqlquery.where = {}
    sqlquery.where.ExamTypeId = parseInt(req.query.examType)
  }
  if (req.query.subjectId) {
    sqlquery.include[0].where = {SubjectId: parseInt(req.query.subjectId)}
  } else if (req.query.subject) {
    sqlquery.include[0].include[0] = {model: Subject, where: {name: {[Op.like]: '%'+req.query.subject+'%'}}}
  }
  if (req.query.examinerId) {
    if (!sqlquery.include[0].where) sqlquery.include[0].where = {}
    sqlquery.include[0].where.ExaminerId = parseInt(req.query.examinerId)
  } else if (req.query.examiner) {
    sqlquery.include[0].include[1] = {model: Examiner, where: {name: {[Op.like]: '%'+req.query.examiner+'%'}}}
  }

  console.log(sqlquery)

  //results
  sqlquery.order = [['id', 'DESC']]
  sqlquery.limit = 100
  sqlquery.offset = 0
  const results = await Exam.findAll(sqlquery)
  results.forEach(r => {
    r.readableDate = new Date(r.date).toLocaleDateString('de-DE')
    r.subjects = r.SubjectExams.map(se => se.Subject.name).join(', ')
  })
  res.tmplOpts.results = results
  res.tmplOpts.query = req.query
  res.tmplOpts.multiDLIds = results.map(r => r.id).join('-')
  tmpl.render('app/main.twig', res.tmplOpts).then(rendered => res.end(rendered))
}