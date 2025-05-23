const sequelize = require('sequelize')
const { ExamType, Subject, ExamLocation, Examiner } = requiremain('./db/db')

module.exports = async (req, res) => {
  const examType = await ExamType.findByPk(req.body.examType)
  if (!examType) return res.status(400).send()
  const validSubjects = validate(req.body)
  if (!validSubjects) return res.status(400).send()
  const exam = await req.user.createExam({
    date: req.body.date,
    studentCount: req.body.studentCount,
    grade: req.body.grade,
    comment: req.body.comment,
    ExamTypeId: examType.id
  })
  const location = await getOrCreateMetadata(ExamLocation, req.body.locationId, req.body.location)
  await exam.setExamLocation(location)
  for (let i = 0; i < validSubjects; i++) {
    await storeReport(i, exam, req)
  }
  res.redirect('/app/exam/'+exam.id)
}

async function storeReport (i, exam, req) {
  const examiner = await getOrCreateMetadata(Examiner, req.body['examinerId'+i], fixExaminerName(req.body['examiner'+i]))
  const subject = await getOrCreateMetadata(Subject, req.body['subjectId'+i], req.body['subject'+i])
  const report = await exam.createSubjectExam({
    report: req.body['report'+i],
    SubjectId: subject.id,
    ExaminerId: examiner.id
  })
}

async function getOrCreateMetadata (model, id, rawName) {
  const name = rawName.trim()
  let found =  null
  if (parseInt(id))
    found = model.findByPk(parseInt(id))
  else
    found = await model.findOne({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('name')), 
        sequelize.fn('lower', name)
      )
    })
  if (found) return found
  return model.create({name})
}

function fixExaminerName (name) {
  name = name.replaceAll('Dr', '')
  name = name.replaceAll('Prof', '')
  name = name.replaceAll('Med', '')
  name = name.replaceAll('dr', '')
  name = name.replaceAll('prof', '')
  name = name.replaceAll('med', '')
  name = name.replaceAll('PD', '')
  name = name.replaceAll('pd', '')
  name = name.replaceAll('Pd', '')
  name = name.replaceAll('.', '')
  name = name.trim()
  return name
}

function validate (body) {
  if (!body.location || body.location.length < 3) return 0
  let i = 0
  while (true) {
    if (!body['examiner'+i] || body['examiner'+i].length < 3) break
    if (!body['subject'+i] || body['subject'+i].length < 3) break
    if (!body['report'+i] || body['report'+i].length < 30) break
    i++
  }
  return i
}