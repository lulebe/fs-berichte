const { Settings } = require('./db')

const SETTINGS_KEYS = {
  RESEARCH_REPORTS_PUBLIC: 1
}

async function getSetting (key) {
  const entry = await Settings.findByPk(key)
  if (!entry) throw new Error("Key not in DB")
  return entry.dataValues.value
}

async function setSetting (key, value) {
  const entry = await Settings.upsert({id: key, value})
  return entry
}

module.exports = { getSetting, setSetting, SETTINGS_KEYS }