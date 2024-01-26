const { setSetting, SETTINGS_KEYS } = requiremain('./db/stored_settings')

module.exports = async (req, res, next) => {
  if (req.body.awardDescription) {
    await setSetting(SETTINGS_KEYS.AWARD_DESCRIPTION, req.body.awardDescription)
  }
  next()
}