const PDFDocument = require('pdfkit')
const commonmark = require('commonmark')
const CommonmarkPDFRenderer = require('pdfkit-commonmark').default
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
  doc.fontSize(9).text("© lehre.fsmed-hd.de", 255, 170)
  doc.moveTo(70, 180).lineTo(525, 180).stroke()
}

async function renderExamPartially (id, doc, query, first) {
  const exam = await Exam.findByPk(id, {include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation]})
  if (!exam) return
  let firstDone = false
  exam.SubjectExams.forEach((se, i) => {
    if (!shouldInclude(se, query)) return
    if (first && !firstDone)
      doc.fontSize(18).text(exam.dateReadable, 70, 200)
    else
      doc.fontSize(18).text(exam.dateReadable)
    firstDone = true
    const description = se.Examiner.name + " (" + exam.ExamLocation.name + ") - " + se.Subject.name
    doc.outline.addItem(exam.dateReadable + ": " + description)
    doc.font('Helvetica').fontSize(11).text("Note: " + (exam.grade || ""))
    const reader = new commonmark.Parser()
    const writer = new CommonmarkPDFRenderer({fontSize: 11})
    const parsedComment = reader.parse(exam.comment || "")
    writer.render(doc, parsedComment)
    doc.moveDown()
    doc.font('Helvetica-Bold').fontSize(11).text(description)
    doc.moveDown()
    const parsedReport = reader.parse(se.report || "")
    writer.render(doc, parsedReport)
    doc.font('Helvetica')
    doc.moveDown()
    doc.moveDown()
  })
}

async function renderWholeExam (id, doc) {
  const exam = await Exam.findByPk(id, {include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation]})
  if (!exam) return
  doc.addPage()
  doc.outline.addItem(exam.dateReadable)
  doc.image(joinpath(__dirname, '../../assets/fsmedlogo.png'), 425, 50, {
    fit: [100, 100],
    align: 'right',
    valign: 'top'
  })
  doc.font('Helvetica').fontSize(20).text("Bericht vom " + exam.dateReadable, 70, 80)
  doc.moveDown()
  doc.fontSize(15).text(exam.ExamLocation.name)
  doc.text("Note: " + (exam.grade || ""))
  doc.fontSize(9).text("© lehre.fsmed-hd.de", 255, 170)
  doc.moveTo(50, 180).lineTo(545, 180).stroke()
  doc.fontSize(18).text("Kommentar", 70, 200)
  const reader = new commonmark.Parser()
  const writer = new CommonmarkPDFRenderer({fontSize: 11})
  const parsed = reader.parse(exam.comment || "")
  writer.render(doc, parsed)
  doc.font('Helvetica')
  doc.moveDown()
  doc.moveDown()
  exam.SubjectExams.forEach((se, i) => {
    doc.fontSize(18).text(se.Subject.name)
    doc.fontSize(13).text(se.Examiner.name)
    doc.moveDown()
    const parsed = reader.parse(se.report)
    writer.render(doc, parsed)
    doc.font('Helvetica')
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