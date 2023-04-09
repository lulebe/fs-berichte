const PDFDocument = require('pdfkit')
const joinpath = require('path').join

const { Exam, ExamLocation, SubjectExam, Subject, Examiner } = requiremain('./db/db')

module.exports = async (req, res) => {
  if (!req.query.exams) return res.status(400).send()
  const doc = new PDFDocument({size: 'A4', autoFirstPage: false})
  res.set('Content-Disposition', `attachment; filename="fs-reports.pdf"`)
  doc.pipe(res)
  const examIds = req.query.exams.split('-').map(v => parseInt(v))
  const query = JSON.parse(req.query.q)
  const hasQuery = query && (parseInt(query.subjectId) || parseInt(query.examinerId || query.subject || query.examiner))
  if (hasQuery) await renderPartialExamHead(doc, query)
  for (let i = 0; i < examIds.length; i++) {
    const id = examIds[i]
    if (hasQuery)
      await renderExamPartially(id, doc, query, i == 0)
    else
      await renderWholeExam(id, doc)
  }
  doc.end()
}

async function renderPartialExamHead (doc, query) {
  const subject = query.subject
  const examiner = query.examiner
  doc.addPage()
  doc.image(joinpath(__dirname, '../../assets/fsmedlogo.png'), 425, 50, {
    fit: [100, 100],
    align: 'right',
    valign: 'top'
  })
  doc.font('Helvetica').fontSize(20).text(subject, 70, 80)
  doc.moveDown()
  doc.fontSize(15).text(examiner)
  doc.fontSize(9).text("© berichte.fsmed-hd.de", 255, 170)
  doc.moveTo(70, 180).lineTo(525, 180).stroke()
}

async function renderExamPartially (id, doc, query, first) {
  const exam = await Exam.findByPk(id, {include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation]})
  if (!exam) return
  const examDate = new Date(exam.date).toLocaleDateString('de-DE')
  let firstDone = false
  exam.SubjectExams.forEach((se, i) => {
    console.log(shouldInclude(se, query))
    if (!shouldInclude(se, query)) return
    if (first && !firstDone)
      doc.fontSize(18).text(examDate, 70, 200)
    else
      doc.fontSize(18).text(examDate)
    firstDone = true
    const description = se.Examiner.name + " (" + exam.ExamLocation.name + ") - " + se.Subject.name
    doc.outline.addItem(examDate + ": " + description)
    doc.font('Helvetica-Bold').fontSize(11).text(description)
    doc.moveDown()
    doc.font('Helvetica').fontSize(11).text(se.report.replace(/\r\n|\r/g, '\n'))
    doc.moveDown()
    doc.moveDown()
  })
}

async function renderWholeExam (id, doc) {
  const exam = await Exam.findByPk(id, {include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation]})
  if (!exam) return
  const examDate = new Date(exam.date).toLocaleDateString('de-DE')
  doc.addPage()
  doc.outline.addItem(examDate)
  doc.image(joinpath(__dirname, '../../assets/fsmedlogo.png'), 425, 50, {
    fit: [100, 100],
    align: 'right',
    valign: 'top'
  })
  doc.font('Helvetica').fontSize(20).text("Bericht vom " + examDate, 70, 80)
  doc.moveDown()
  doc.fontSize(15).text(exam.ExamLocation.name)
  doc.fontSize(9).text("© berichte.fsmed-hd.de", 255, 170)
  doc.moveTo(70, 180).lineTo(525, 180).stroke()
  exam.SubjectExams.forEach((se, i) => {
    if (!i)
      doc.fontSize(18).text(se.Subject.name, 70, 200)
    else
      doc.fontSize(18).text(se.Subject.name)
    doc.fontSize(13).text(se.Examiner.name)
    doc.moveDown()
    doc.fontSize(11).text(se.report.replace(/\r\n|\r/g, '\n'))
    doc.moveDown()
    doc.moveDown()
  })
}

function shouldInclude (subjectExam, query) {
  const subjectId = parseInt(query.subjectId)
  const subject = query.subject
  const examinerId = parseInt(query.examinerId)
  const examiner = parseInt(query.examiner)
  if (subjectId) return subjectExam.Subject.id == subjectId
  if (examinerId) return subjectExam.Examiner.id == examinerId
  if (subject) return subjectExam.Subject.name.includes(subject)
  if (examiner) return subjectExam.Examiner.name.includes(examiner)
  return false
}