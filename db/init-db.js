const db = require('./db')
const bcrypt = require('bcryptjs')
const config = require('../config')
const { setSetting, SETTINGS_KEYS } = require('./stored_settings')

module.exports = new Promise(resolve => {
  db.init().then(() => {
    setSetting(SETTINGS_KEYS.RESEARCH_REPORTS_PUBLIC, false)
    setSetting(SETTINGS_KEYS.PETITIONS_REQUIRE_ADMIN_CONFIRMATION, false)
    setSetting(SETTINGS_KEYS.PETITION_HOW_TO, '')
    setSetting(SETTINGS_KEYS.AWARD_DESCRIPTION, '')
    setSetting(SETTINGS_KEYS.LOGIN_DESCRIPTION, '')
    setSetting(SETTINGS_KEYS.LOGIN_REGISTER_EXPLAINER, '')
    const password = bcrypt.hashSync("testpw", bcrypt.genSaltSync(config.SALT_ROUNDS))
    db.User.create({email: "test@example.com", activated: true, authorized: true, isAdmin: true, password})
    .then(() => {
      console.log('DB initialized, PLEASE REMOVE TESTUSER')
      resolve()
    })
  })
})