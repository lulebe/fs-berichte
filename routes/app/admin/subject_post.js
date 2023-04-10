const { Subject, SubjectExam } = requiremain('./db/db')

module.exports = async (req, res) => {
  const subject = await Subject.findByPk(req.params.id)
  if (parseInt(req.body.joinId)) {
    await SubjectExam.update({'SubjectId': parseInt(req.body.joinId)}, {where: {'SubjectId': req.params.id}})
    await subject.destroy()
  }
  if (req.body.newname) 
    await Subject.update({'name': req.body.newname}, {where: {'id': req.params.id}})
  if (req.body.delete)
    await subject.destroy()
  res.redirect('/app/admin/subjects')
}