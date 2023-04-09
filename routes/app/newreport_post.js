const { ExamType, Subject, ExamLocation, Examiner } = requiremain('./db/db')

module.exports = async (req, res) => {
  const examType = await ExamType.findByPk(req.body.examType)
  if (!examType) return res.status(400).send()
  const exam = await req.user.createExam({
    date: req.body.date,
    studentCount: req.body.studentCount,
    grade: req.body.grade,
    comment: req.body.comment,
    ExamTypeId: examType.id
  })
  let location = null
  if (req.body.locationId)
    location = await ExamLocation.findByPk(req.body.locationId)
  else
    location = await ExamLocation.create({name: req.body.location})
  await exam.setExamLocation(location)
  for (let i = 1; i <= examType.subjectCount; i++) {
    await storeReport(i, exam, req)
  }
  res.redirect('/app/exam/'+exam.id)
}

async function storeReport (i, exam, req) {
  let examiner = null
  if (req.body['examinerId'+i])
    examiner = await Examiner.findByPk(req.body['examinerId'+i])
  else
    examiner = await Examiner.create({name: req.body['examiner'+i]})
  let subject = null
  if (req.body['subjectId'+i])
    subject = await Subject.findByPk(req.body['subjectId'+i])
  else
    subject = await Subject.create({name: req.body['subject'+i]})
  const report = await exam.createSubjectExam({
    report: req.body['report'+i],
    SubjectId: subject.id,
    ExaminerId: examiner.id
  })
}