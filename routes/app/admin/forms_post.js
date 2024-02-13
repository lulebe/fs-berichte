const { Form, User } = requiremain('./db/db')

module.exports = async (req, res, next) => {
  if (req.body.title) {
    const form = await Form.create(req.body)
    User.notifyWhere({isFormsUser: true}, 'Neue Umfrage', form.title, '/app/forms/' + form.id)
  }
  if (req.body.deleteForm) {
    const form = await Form.findByPk(req.body.deleteForm)
    await form.destroy()
  }
  next()
}