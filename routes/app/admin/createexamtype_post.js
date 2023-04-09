const { ExamType } = require.main.require('./db/db')


module.exports = async (req, res) => {
  console.log(req.body)
  if (!req.body.examtypename) return res.status(400).send()
  await ExamType.create({name: req.body.examtypename, subjectCount: req.body.examtypesubjectcount})
  res.redirect('/app/admin/examtypes')
}