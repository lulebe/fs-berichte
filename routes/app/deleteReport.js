const { Exam } = requiremain('./db/db')

module.exports = async (req, res) => {
  const exam = await Exam.findByPk(req.params.id)
  if (!req.user.isAdmin && exam.UserId !== req.user.id) return res.status(403).send()
  await exam.destroy()
  res.redirect('/app/exam')
}