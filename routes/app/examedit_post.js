const sequelize = require('sequelize')
const { Exam, ExamType, Subject, ExamLocation, Examiner } = requiremain('./db/db')

module.exports = async (req, res) => {
  const exam = await Exam.findByPk(req.params.id)
  if (!exam) return res.status(404).send()
  exam.date = req.body.date
  exam.studentCount = req.body.studentCount
  exam.grade = req.body.grade
  exam.comment = req.body.comment
  await exam.save()
  const location = await getOrCreateMetadata(ExamLocation, req.body.locationId, req.body.location)
  await exam.setExamLocation(location)
  await Promise.all((await exam.getSubjectExams()).map(se => updateReport(se, req.body)))
  res.redirect('/app/exam/'+exam.id)
}

async function updateReport (report, data) {
  const examiner = await getOrCreateMetadata(Examiner, data['examinerId'+report.id], data['examiner'+report.id])
  const subject = await getOrCreateMetadata(Subject, data['subjectId'+report.id], data['subject'+report.id])
  report.report = data['report'+report.id]
  report.SubjectId = subject.id
  report.ExaminerId = examiner.id
  await report.save()
}

async function getOrCreateMetadata (model, id, rawName) {
  const name = rawName.trim()
  if (parseInt(id)) return model.findByPk(parseInt(id))
  const found = await model.findOne({
    where: sequelize.where(
      sequelize.fn('lower', sequelize.col('name')), 
      sequelize.fn('lower', name)
    )
  })
  if (found) return found
  return model.create({name})
}