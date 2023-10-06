const PDFDocument = require('pdfkit')
const joinpath = require('path').join

const { Exam, ExamLocation, SubjectExam, Subject, Examiner } = requiremain('./db/db')

module.exports = async (req, res) => {
  const exam = await Exam.findByPk(req.params.id, {include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation]})
  if (!exam) return res.status(404).send()
  
  const doc = new PDFDocument({size: 'A4'})

  res.set('Content-Disposition', `attachment; filename="fs-report-${exam.dateReadable}.pdf"`)
  doc.pipe(res)
  doc.image(joinpath(__dirname, '../../assets/fsmedlogo.png'), 425, 50, {
    fit: [100, 100],
    align: 'right',
    valign: 'top'
  })
  doc.font('Helvetica').fontSize(20).text("Bericht vom " + exam.dateReadable, 70, 80)
  doc.moveDown()
  doc.fontSize(15).text(exam.ExamLocation.name)
  doc.text("Note: " + (exam.grade || ""))
  doc.fontSize(9).text("© berichte.fsmed-hd.de", 255, 170)
  doc.moveTo(70, 180).lineTo(525, 180).stroke()
  doc.fontSize(18).text("Kommentar", 70, 200)
  doc.fontSize(11).text(exam.comment ? exam.comment.replace(/\r\n|\r/g, '\n') : "")
  doc.moveDown()
  exam.SubjectExams.forEach((se, i) => {
    doc.fontSize(18).text(se.Subject.name)
    doc.fontSize(13).text(se.Examiner.name)
    doc.moveDown()
    doc.fontSize(11).text(se.report.replace(/\r\n|\r/g, '\n'))
    doc.moveDown()
    doc.moveDown()
  })
  doc.end()
}