const PDFDocument = require('pdfkit')
const joinpath = require('path').join

const { Exam, ExamLocation, SubjectExam, Subject, Examiner } = require.main.require('./db/db')

module.exports = async (req, res) => {
  const exam = await Exam.findByPk(req.params.id, {include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation]})
  if (!exam) return res.status(404).send()
  const examDate = new Date(exam.date).toLocaleDateString('de-DE')
  
  const doc = new PDFDocument({size: 'A4'})

  res.set('Content-Disposition', `attachment; filename="fs-report-${examDate}.pdf"`)
  doc.pipe(res)
  doc.image(joinpath(__dirname, '../../assets/fsmedlogo.png'), 445, 50, {
    fit: [100, 100],
    align: 'right',
    valign: 'top'
  })
  doc.font('Helvetica').fontSize(20).text("Bericht vom " + examDate, 50, 80)
  doc.moveDown()
  doc.fontSize(15).text(exam.ExamLocation.name)
  doc.fontSize(9).text("© berichte.fsmed-hd.de", 255, 170)
  doc.moveTo(50, 180).lineTo(545, 180).stroke()
  exam.SubjectExams.forEach((se, i) => {
    if (!i)
      doc.fontSize(18).text(se.Subject.name, 50, 200)
    else
      doc.fontSize(18).text(se.Subject.name)
    doc.fontSize(13).text(se.Examiner.name)
    doc.moveDown()
    doc.fontSize(11).text(se.report.replace(/\r\n|\r/g, '\n'))
    doc.moveDown()
    doc.moveDown()
  })
  doc.end()
}