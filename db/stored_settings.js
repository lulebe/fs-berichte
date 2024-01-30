const { Settings } = require('./db')

const SETTINGS_KEYS = {
  RESEARCH_REPORTS_PUBLIC: 1,
  PETITIONS_REQUIRE_ADMIN_CONFIRMATION: 2,
  PETITION_HOW_TO: 3,
  AWARD_DESCRIPTION: 4,
  LOGIN_DESCRIPTION: 5,
  LOGIN_REGISTER_EXPLAINER: 6
}

async function getSetting (key) {
  const entry = await Settings.findByPk(key)
  if (!entry) throw new Error("Key not in DB")
  return entry.dataValues.value
}

async function setSetting (key, value) {
  const cappedValue = value && value.length && value.length > 4000 ? value.substring(0, 4000) : value
  const entry = await Settings.upsert({id: key, value: cappedValue})
  return entry
}

module.exports = { getSetting, setSetting, SETTINGS_KEYS }