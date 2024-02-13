const tmpl = requiremain('./templates')

const { Form } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.form = await Form.findByPk(req.params.id)
  if (!res.tmplOpts.form) return res.redirect('/app/forms')
  tmpl.render('app/form.twig', res.tmplOpts).then(rendered => res.end(rendered))
}