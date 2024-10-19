const { ExamType } = requiremain('./db/db')


module.exports = async (req, res) => {
  if (!req.body.examtypename) return res.status(400).send()
  await ExamType.create({name: req.body.examtypename})
  res.redirect('/app/admin/examtypes')
}