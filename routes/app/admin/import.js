const { Examiner, SubjectExam, Exam, ExamLocation, Subject, ExamType } = requiremain('./db/db')

const tmpl = requiremain('./templates')

module.exports = async (req, res) => {
  if (!req.body.import) {
    tmpl.render('app/admin/import.twig', res.tmplOpts).then(rendered => res.end(rendered))
    return
  }
  try {
    const oldData = requiremain('./olddata.json')
    const examinerMap = await importExaminers(oldData.examiners)
    const subjectMap = await importSubjects(oldData.subjects)
    const locationMap = await importLocations(oldData.protocols)
    const skipped = []
    for (let i = 0; i < oldData.protocols.length; i++) {
      const oldProtocol = oldData.protocols[i]
      oldProtocol.pdate = oldProtocol.pdate.replace(',', '.')
      if (oldProtocol.pdate.length == 10)
        oldProtocol.pdate = oldProtocol.pdate.split('.').reverse().join('/')
      if (isNaN(new Date(oldProtocol.pdate).getTime())) {
        console.log(oldProtocol.pdate)
        return
      }
      const oldSubjectProtocols = oldData.protocol_examiner.filter(pe => pe.protocol == oldProtocol.id)
      const isM1 = oldSubjectProtocols[0].subject < 5
      const newProtocol = await Exam.create({
        date: new Date(oldProtocol.pdate),
        grade: oldProtocol.grades,
        comment: oldProtocol.comments + '\n\n' + oldProtocol.freetext,
        UserId: 7, //TODO:
        ExamTypeId: isM1 ? 1 : 2, //TODO:
        ExamLocationId: oldProtocol.plocation ? locationMap[oldProtocol.plocation] : null
      })
      for (let j = 0; j < oldSubjectProtocols.length; j++) {
        const sp = oldSubjectProtocols[j]
        if (!subjectMap[sp.subject] || !examinerMap[sp.examiner] || !sp.topics) {
          skipped.push(sp.id)
          continue
        }
        const subjectExam = await SubjectExam.create({
          report: sp.topics,
          ExamId: newProtocol.id,
          SubjectId: subjectMap[sp.subject],
          ExaminerId: examinerMap[sp.examiner]
        })
      }
    }
  } catch (e) {
    res.status(200).send(e)
  }
  res.send("ok")
}

async function importExaminers (examiners) {
  const examinerMap = {}
  for (let i = 0; i < examiners.length; i++) {
    const oldExaminer = examiners[i]
    const newExaminer = await Examiner.create({
      name: oldExaminer.name
    })
    examinerMap[oldExaminer.id] = newExaminer.id
  }
  return examinerMap
}

async function importSubjects (subjects) {
  const subjectMap = {}
  for (let i = 0; i < subjects.length; i++) {
    const oldSubject = subjects[i]
    const newSubject = await Subject.create({
      name: oldSubject.name
    })
    subjectMap[oldSubject.id] = newSubject.id
  }
  return subjectMap
}

async function importLocations (protocols) {
  const locationMap = {}
  for (let i = 0; i < protocols.length; i++) {
    const protocol = protocols[i]
    if (!protocol.plocation || locationMap[protocol.plocation]) continue
    const newLocation = await ExamLocation.create({
      name: protocol.plocation
    })
    locationMap[protocol.plocation] = newLocation.id
  }
  return locationMap
}

function findProtocolData (id, oldData) {
  const data = {examType: 1}
  data.protocols = oldData.protocol_examiner.filter(pe => pe.protocol == id)
  return data
}