const sequelize = require('sequelize')

const md = requiremain('./markdownrender')
const tmpl = requiremain('./templates')


const { Petition, PetitionComment, PETITION_STATUS, PETITION_STATUS_STRINGS, Tag, User } = requiremain('./db/db')

module.exports = async (req, res) => {
  const petition = await Petition.findByPk(req.params.id, {include: [Tag, User, {model: PetitionComment, include: [User]}], order: [[PetitionComment, 'createdAt', 'DESC']]})
  petition.textHtml = md(petition.text)
  res.tmplOpts.petition = petition
  res.tmplOpts.petition.supporterCount = await petition.countSupporters()
  res.tmplOpts.indicatorLength = res.tmplOpts.petition.supporterCount / petition.goal * 100
  if (req.user)
    res.tmplOpts.isSupporting = await petition.hasSupporter(req.user)
  res.tmplOpts.daysLeft = Math.ceil((new Date(petition.deadline) - new Date()) / (1000 * 60 * 60 * 24))
  const publicSupporters = await petition.getSupporters({where: {anonymous: false}, order: sequelize.literal('rand()'), limit: 4})
  res.tmplOpts.supporterNames = publicSupporters.map(u => u.displayName).join(', ')
  res.tmplOpts.isActive = petition.status === PETITION_STATUS.ACTIVE && petition.beforeDeadline
  res.tmplOpts.isCancelled = petition.status === PETITION_STATUS.CANCELLED
  res.tmplOpts.nextStep = PETITION_STATUS_STRINGS[petition.status+1]
  res.tmplOpts.prevStep = PETITION_STATUS_STRINGS[petition.status-1]
  tmpl.render('app/petitions/petition.twig', res.tmplOpts).then(rendered => res.end(rendered))
}