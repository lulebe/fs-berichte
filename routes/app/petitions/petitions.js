const { Op } = require("sequelize")

const tmpl = requiremain('./templates')

const { Petition, Tag, PETITION_STATUS } = requiremain('./db/db')

module.exports = async (req, res) => {
  const where = {status: {[Op.gte]: req.user.isPetitionsAdmin ? 0 : 1}}
  let tagInclude = Tag
  if (req.query.tags) {
    if (!Array.isArray(req.query.tags)) req.query.tags = [req.query.tags]
    tagInclude = {
      model: Tag,
        where: {
            id: req.query.tags
        }
    }
  }
  const results = await Petition.findAll({where, limit: 50, offset: 0, order: [['createdAt', 'DESC']], include: [tagInclude]})
  await Promise.all(results.map(async (p) => {
    p.isSupporting = await p.hasSupporter(req.user)
    const count = await p.countSupporters()
    p.supporterCount = count
    p.percentage = count / p.goal * 100
    p.isActive =p.status === PETITION_STATUS.ACTIVE && p.beforeDeadline
  }))
  res.tmplOpts.tags = await Tag.findAll({order: [['name', 'ASC']]})
  res.tmplOpts.results = results
  res.tmplOpts.selectedTags = req.query.tags || []
  res.tmplOpts.query = req.query
  res.tmplOpts.userPetitions = await Petition.findAll({where: {UserId: req.user.id}, order: [['createdAt', 'DESC']], include: [Tag]})
  tmpl.render('app/petitions/petitions.twig', res.tmplOpts).then(rendered => res.end(rendered))
}