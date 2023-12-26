const tmpl = requiremain('./templates')

const { Form } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.forms = await Form.findAll({order: [['id', 'DESC']]})
  tmpl.render('app/admin/forms.twig', res.tmplOpts).then(rendered => res.end(rendered))
}