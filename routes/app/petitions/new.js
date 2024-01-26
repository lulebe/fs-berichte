const md = require('markdown-it')()

const tmpl = requiremain('./templates')

const { Tag } = requiremain('./db/db')
const { getSetting, SETTINGS_KEYS } = requiremain('./db/stored_settings')

module.exports = async (req, res) => {
  res.tmplOpts.tags = await Tag.findAll()
  const d = new Date()
  res.tmplOpts.currentDate = d.getUTCFullYear() + "-" + (d.getUTCMonth()+1+"").padStart(2, "0") + "-" + (""+d.getUTCDate()).padStart(2, "0")
  d.setMonth(d.getMonth() + 2)
  res.tmplOpts.deadlineDate = d.getUTCFullYear() + "-" + (d.getUTCMonth()+1+"").padStart(2, "0") + "-" + (""+d.getUTCDate()).padStart(2, "0")
  res.tmplOpts.adminApproval = (await getSetting(SETTINGS_KEYS.PETITIONS_REQUIRE_ADMIN_CONFIRMATION)) === '1'
  res.tmplOpts.howTo = md.render(await getSetting(SETTINGS_KEYS.PETITION_HOW_TO))
  tmpl.render('app/petitions/new.twig', res.tmplOpts).then(rendered => res.end(rendered))
}