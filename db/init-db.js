const db = require('./db')
const bcrypt = require('bcryptjs')
const config = require('../config')
const { Settings } = require('./db')

module.exports = new Promise(resolve => {
  db.init().then(() => {
    Settings.set(Settings.KEYS.RESEARCH_REPORTS_PUBLIC, false)
    Settings.set(Settings.KEYS.PETITIONS_REQUIRE_ADMIN_CONFIRMATION, false)
    Settings.set(Settings.KEYS.PETITION_HOW_TO, '')
    Settings.set(Settings.KEYS.AWARD_DESCRIPTION, '')
    Settings.set(Settings.KEYS.LOGIN_DESCRIPTION, '')
    Settings.set(Settings.KEYS.LOGIN_REGISTER_EXPLAINER, '')
    Settings.set(Settings.KEYS.USER_ACTIVE_DURATION, 7)
    Settings.set(Settings.KEYS.AUTHORIZED_DOMAIN, 'example.com')
    Settings.set(Settings.KEYS.VAPID_PUBLIC_KEY, 'BGRJZ9PtHZus9DFh_0PbCHR-yOb3Y7nDQuQS5u6f5EfxFdzXQm2RKxJUOR4V_uImLPPeWDojNwjWBcVsBGkNQVw')
    Settings.set(Settings.KEYS.VAPID_PRIVATE_KEY, '32CpAppEIHS8YQCKHmyl5eRICti6dDXJH43pBr0OBw8')
    Settings.set(Settings.KEYS.ADMIN_EMAIL, 'test@example.com')
    Settings.set(Settings.KEYS.MAIL_HOST, 'localhost')
    Settings.set(Settings.KEYS.MAIL_USER, 'test@example.com')
    Settings.set(Settings.KEYS.MAIL_PASSWORD, 'testpw')
    Settings.set(Settings.KEYS.MAIL_SENDER, '"Test" <test@example.com>')
    Settings.set(Settings.KEYS.ROOT_URL, 'http://localhost:8080')
    Settings.set(Settings.KEYS.COOKIE_SECRET, 'testsecret')
    Settings.set(Settings.KEYS.JWT_SECRET, 'testsecret')
    const password = bcrypt.hashSync("testpw", bcrypt.genSaltSync(config.SALT_ROUNDS))
    db.User.create({email: "test@example.com", password, activated: true, authorized: true, isAdmin: true, isReportsUser: true, isFormsUser: true, isPetitionsUser: true, isAwardsUser: true})
    .then(() => {
      console.log('DB initialized, PLEASE REMOVE TESTUSER')
      resolve()
    })
  })
})