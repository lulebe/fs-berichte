const tmpl = requiremain('./templates')

const { Petition, Tag } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.tags = await Tag.findAll()
  const d = new Date()
  res.tmplOpts.currentDate = d.getUTCFullYear() + "-" + (d.getUTCMonth()+1+"").padStart(2, "0") + "-" + (""+d.getUTCDate()).padStart(2, "0")
  d.setMonth(d.getMonth() + 2)
  res.tmplOpts.deadlineDate = d.getUTCFullYear() + "-" + (d.getUTCMonth()+1+"").padStart(2, "0") + "-" + (""+d.getUTCDate()).padStart(2, "0")
  tmpl.render('app/petitions/new.twig', res.tmplOpts).then(rendered => res.end(rendered))
}