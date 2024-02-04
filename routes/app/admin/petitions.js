const tmpl = requiremain('./templates')

const { Petition, Tag, Settings } = requiremain('./db/db')

module.exports = async (req, res) => {
  console.log(await Settings.get(Settings.KEYS.PETITIONS_REQUIRE_ADMIN_CONFIRMATION))
  res.tmplOpts.tags = await Tag.findAll({order: [['name', 'ASC']]})
  res.tmplOpts.petitionsRequireAdminConfirmation = (await Settings.get(Settings.KEYS.PETITIONS_REQUIRE_ADMIN_CONFIRMATION)) == 1
  res.tmplOpts.petitionsAwaitingConfirmation = await Petition.findAll({where: {status: 0}})
  res.tmplOpts.howTo = await Settings.get(Settings.KEYS.PETITION_HOW_TO)
  tmpl.render('app/admin/petitions.twig', res.tmplOpts).then(rendered => res.end(rendered))
}