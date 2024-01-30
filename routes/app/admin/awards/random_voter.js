const Sequelize = require('sequelize')

const { AwardVote, User } = requiremain('./db/db')

module.exports = async (req, res) => {
  const voter = await AwardVote.findOne({where: {AwardId: req.params.id}, include: [User], order: Sequelize.literal('rand()')})
  res.json(voter ? voter.User : null)
}