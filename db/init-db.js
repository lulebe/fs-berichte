const db = require('./db')
const bcrypt = require('bcryptjs')
const config = require('../config')
const { Settings } = require('./db/db')

module.exports = new Promise(resolve => {
  db.init().then(() => {
    Settings.set(SETTINGS_KEYS.RESEARCH_REPORTS_PUBLIC, false)
    Settings.set(Settings.KEYS.PETITIONS_REQUIRE_ADMIN_CONFIRMATION, false)
    Settings.set(Settings.KEYS.PETITION_HOW_TO, '')
    Settings.set(Settings.KEYS.AWARD_DESCRIPTION, '')
    Settings.set(Settings.KEYS.LOGIN_DESCRIPTION, '')
    Settings.set(Settings.KEYS.LOGIN_REGISTER_EXPLAINER, '')
    Settings.set(Settings.KEYS.USER_ACTIVE_DURATION, 7)
    Settings.set(Settings.KEYS.AUTHORIZED_DOMAIN, 'example.com')
    const password = bcrypt.hashSync("testpw", bcrypt.genSaltSync(config.SALT_ROUNDS))
    db.User.create({email: "test@example.com", activated: true, authorized: true, isAdmin: true, password})
    .then(() => {
      console.log('DB initialized, PLEASE REMOVE TESTUSER')
      resolve()
    })
  })
})