const { Form } = requiremain('./db/db')

module.exports = async (req, res, next) => {
  if (req.body.title) {
    await Form.create(req.body)
  }
  if (req.body.deleteForm) {
    const form = await Form.findByPk(req.body.deleteForm)
    await form.destroy()
  }
  next()
}