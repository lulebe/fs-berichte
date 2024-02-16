const tmpl = requiremain('./templates')

const { Settings } = requiremain('./db/db')

module.exports = async (req, res) => {
  if (req.body.settingskey && req.body.settingsvalue) {
    await Settings.set(req.body.settingskey, req.body.settingsvalue)
  }
  res.redirect('/app/admin/settings')
}