const tmpl = requiremain('./templates')

const { Award } = requiremain('./db/db')
const { getSetting, SETTINGS_KEYS } = requiremain('./db/stored_settings')

module.exports = async (req, res) => {
  res.tmplOpts.awards = await Award.findAll({order: [['createdAt', 'DESC']]})
  res.tmplOpts.awardDescription = await getSetting(SETTINGS_KEYS.AWARD_DESCRIPTION)
  tmpl.render('app/admin/awards.twig', res.tmplOpts).then(rendered => res.end(rendered))
}