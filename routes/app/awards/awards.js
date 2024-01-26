const { Op } = require('sequelize')
const tmpl = requiremain('./templates')

const { Award } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.awards = await Award.findAll({where: {status: {[Op.gte]: Award.STATUS.PUBLISHED}}, order: [['createdAt', 'desc']]})
  tmpl.render('app/awards/awards.twig', res.tmplOpts).then(rendered => res.end(rendered))
}