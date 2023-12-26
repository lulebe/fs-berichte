const { Op } = require("sequelize")

const tmpl = requiremain('./templates')

const { Petition, Tag } = requiremain('./db/db')

module.exports = async (req, res) => {
  const where = {status: {[Op.gte]: req.user.isAdmin ? 0 : 1}}
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
  res.tmplOpts.tags = await Tag.findAll({order: [['name', 'ASC']]})
  res.tmplOpts.results = results
  res.tmplOpts.selectedTags = req.query.tags || []
  res.tmplOpts.query = req.query
  res.tmplOpts.userPetitions = await Petition.findAll({where: {UserId: req.user.id}, order: [['createdAt', 'DESC']], include: [Tag]})
  tmpl.render('app/petitions/petitions.twig', res.tmplOpts).then(rendered => res.end(rendered))
}