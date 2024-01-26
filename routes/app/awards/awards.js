const { Op } = require('sequelize')
const md = require('markdown-it')()

const tmpl = requiremain('./templates')
const { Award } = requiremain('./db/db')
const { getSetting, SETTINGS_KEYS } = requiremain('./db/stored_settings')

module.exports = async (req, res) => {
  res.tmplOpts.awards = await Award.findAll({where: {status: {[Op.gte]: req.user.isAdmin ? 0 : 1}}, order: [['createdAt', 'desc']]})
  res.tmplOpts.awardDescription = md.render(await getSetting(SETTINGS_KEYS.AWARD_DESCRIPTION)).replaceAll('<a', '<a target="_blank"')
  tmpl.render('app/awards/awards.twig', res.tmplOpts).then(rendered => res.end(rendered))
}