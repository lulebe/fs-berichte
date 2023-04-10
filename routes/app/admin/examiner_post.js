const { Examiner, SubjectExam } = requiremain('./db/db')

module.exports = async (req, res) => {
  const examiner = await Examiner.findByPk(req.params.id)
  if (parseInt(req.body.joinId)) {
    await SubjectExam.update({'ExaminerId': parseInt(req.body.joinId)}, {where: {'ExaminerId': req.params.id}})
    await Examiner.destroy()
  }
  if (req.body.newname) 
    await Examiner.update({'name': req.body.newname}, {where: {'id': req.params.id}})
  if (req.body.delete)
    await examiner.destroy()
  res.redirect('/app/admin/examiners')
}