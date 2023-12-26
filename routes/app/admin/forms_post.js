const { Form } = requiremain('./db/db')

module.exports = async (req, res, next) => {
  console.log(1)
  if (req.body.title) {
    console.log(2)
    await Form.create(req.body)
  }
  if (req.body.deleteForm) {
    const form = await Form.findByPk(req.body.deleteForm)
    await form.destroy()
  }
  next()
}