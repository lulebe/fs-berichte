const tmpl = requiremain('./templates')

const { Petition, Tag } = requiremain('./db/db')
const { getSetting, SETTINGS_KEYS } = requiremain('./db/stored_settings')

module.exports = async (req, res) => {
  res.tmplOpts.tags = await Tag.findAll({order: [['name', 'ASC']]})
  res.tmplOpts.petitionsRequireAdminConfirmation = (await getSetting(SETTINGS_KEYS.PETITIONS_REQUIRE_ADMIN_CONFIRMATION)) === '1'
  tmpl.render('app/admin/petitions.twig', res.tmplOpts).then(rendered => res.end(rendered))
}