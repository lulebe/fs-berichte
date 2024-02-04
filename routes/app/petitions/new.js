const md = requiremain('./markdownrender')
const tmpl = requiremain('./templates')

const { Tag, Settings } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.tags = await Tag.findAll()
  const d = new Date()
  res.tmplOpts.currentDate = d.getUTCFullYear() + "-" + (d.getUTCMonth()+1+"").padStart(2, "0") + "-" + (""+d.getUTCDate()).padStart(2, "0")
  d.setMonth(d.getMonth() + 2)
  res.tmplOpts.deadlineDate = d.getUTCFullYear() + "-" + (d.getUTCMonth()+1+"").padStart(2, "0") + "-" + (""+d.getUTCDate()).padStart(2, "0")
  res.tmplOpts.adminApproval = !!(await Settings.get(Settings.KEYS.PETITIONS_REQUIRE_ADMIN_CONFIRMATION))
  res.tmplOpts.howTo = md(await Settings.get(Settings.KEYS.PETITION_HOW_TO))
  tmpl.render('app/petitions/new.twig', res.tmplOpts).then(rendered => res.end(rendered))
}