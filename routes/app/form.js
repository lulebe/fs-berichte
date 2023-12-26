const tmpl = requiremain('./templates')

const { Form } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.form = await Form.findByPk(req.params.id)
  tmpl.render('app/form.twig', res.tmplOpts).then(rendered => res.end(rendered))
}