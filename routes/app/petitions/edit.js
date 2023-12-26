const md = require('markdown-it')
const sequelize = require('sequelize');

const tmpl = requiremain('./templates')

const { Petition, PetitionComment, Tag, User } = requiremain('./db/db')

module.exports = async (req, res) => {
  res.tmplOpts.tags = await Tag.findAll()
  const petition = await Petition.findByPk(req.params.id, {include: [Tag, User, {model: PetitionComment, include: [User]}]})
  res.tmplOpts.petition = petition
  res.tmplOpts.selectedTagIds = petition.Tags.map(t => t.id)
  let d = new Date()
  res.tmplOpts.currentDate = d.getUTCFullYear() + "-" + (d.getUTCMonth()+1+"").padStart(2, "0") + "-" + (""+d.getUTCDate()).padStart(2, "0")
  d = new Date(petition.deadline)
  res.tmplOpts.deadlineDate = d.getUTCFullYear() + "-" + (d.getUTCMonth()+1+"").padStart(2, "0") + "-" + (""+d.getUTCDate()).padStart(2, "0")
  tmpl.render('app/petitions/edit.twig', res.tmplOpts).then(rendered => res.end(rendered))
}