const tmpl = requiremain('./templates')

const {  } = requiremain('./db/db')

module.exports = async (req, res) => {
  const d = new Date()
  res.tmplOpts.currentDate = d.getUTCFullYear() + "-" + (d.getUTCMonth()+1+"").padStart(2, "0") + "-" + (""+d.getUTCDate()).padStart(2, "0")
  d.setMonth(d.getMonth() + 2)
  res.tmplOpts.deadlineDate = d.getUTCFullYear() + "-" + (d.getUTCMonth()+1+"").padStart(2, "0") + "-" + (""+d.getUTCDate()).padStart(2, "0")
  tmpl.render('app/admin/awards/new.twig', res.tmplOpts).then(rendered => res.end(rendered))
}