const { ExamType } = requiremain('./db/db')

module.exports = async (req, res) => {
  if (req.body.newname) 
    await ExamType.update({'name': req.body.newname}, {where: {'id': req.params.id}})
  res.redirect('/app/admin/examtypes')
}