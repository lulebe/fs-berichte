const tmpl = requiremain('./templates')

const { Award, Settings } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.awards = await Award.findAll({order: [['createdAt', 'DESC']]})
  res.tmplOpts.awardDescription = await Settings.get(Settings.KEYS.AWARD_DESCRIPTION)
  tmpl.render('app/admin/awards/awards.twig', res.tmplOpts).then(rendered => res.end(rendered))
}