const tmpl = requiremain('./templates')

const { Petition, Tag } = requiremain('./db/db')
const { getSetting, SETTINGS_KEYS } = requiremain('./db/stored_settings')

module.exports = async (req, res) => {
  res.tmplOpts.tags = await Tag.findAll({order: [['name', 'ASC']]})
  res.tmplOpts.petitionsRequireAdminConfirmation = (await getSetting(SETTINGS_KEYS.PETITIONS_REQUIRE_ADMIN_CONFIRMATION)) === '1'
  res.tmplOpts.petitionsAwaitingConfirmation = await Petition.findAll({where: {status: 0}})
  res.tmplOpts.howTo = await getSetting(SETTINGS_KEYS.PETITION_HOW_TO)
  tmpl.render('app/admin/petitions.twig', res.tmplOpts).then(rendered => res.end(rendered))
}