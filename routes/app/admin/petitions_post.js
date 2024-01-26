const { Petition, Tag } = requiremain('./db/db')
const { setSetting, SETTINGS_KEYS } = requiremain('./db/stored_settings')

module.exports = async (req, res, next) => {
  if (req.body.setPetitions) {
    await setSetting(SETTINGS_KEYS.PETITIONS_REQUIRE_ADMIN_CONFIRMATION, req.body.setPetitions === 'private')
  }
  if (req.body.newTag) {
    await Tag.create({name: req.body.newTag})
  }
  if (req.body.deleteTag) {
    if (!Array.isArray(req.body.deleteTag)) req.body.deleteTag = [req.body.deleteTag]
    const deletions = Promise.all(req.body.deleteTag.map(id => Tag.destroy({where: {id}})))
    await deletions
  }
  if (req.body.howTo) {
    await setSetting(SETTINGS_KEYS.PETITION_HOW_TO, req.body.howTo)
  }
  next()
}