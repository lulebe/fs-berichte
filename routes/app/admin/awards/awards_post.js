const { Settings } = requiremain('./db/db')

module.exports = async (req, res, next) => {
  if (req.body.awardDescription) {
    await Settings.set(Settings.KEYS.AWARD_DESCRIPTION, req.body.awardDescription)
  }
  next()
}