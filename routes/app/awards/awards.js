const { Op } = require('sequelize')

const md = requiremain('./markdownrender')
const tmpl = requiremain('./templates')
const { Award, Settings } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.awards = await Award.findAll({where: {status: {[Op.gte]: req.user.isAdmin ? 0 : 1}}, order: [['createdAt', 'desc']]})
  res.tmplOpts.awardDescription = md(await Settings.get(Settings.KEYS.AWARD_DESCRIPTION))
  tmpl.render('app/awards/awards.twig', res.tmplOpts).then(rendered => res.end(rendered))
}