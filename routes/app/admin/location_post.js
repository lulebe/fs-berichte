const { Exam, ExamLocation } = requiremain('./db/db')

module.exports = async (req, res) => {
  const location = await ExamLocation.findByPk(req.params.id)
  if (parseInt(req.body.joinId)) {
    await Exam.update({'ExamLocationId': parseInt(req.body.joinId)}, {where: {'ExamLocationId': req.params.id}})
    await location.destroy()
  }
  if (req.body.newname) 
    await ExamLocation.update({'name': req.body.newname}, {where: {'id': req.params.id}})
  if (req.body.delete)
    await location.destroy()
  res.redirect('/app/admin/locations')
}