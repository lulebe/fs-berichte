const { Petition } = requiremain('./db/db')

module.exports = async (req, res) => {
  const petition = await Petition.findByPk(req.params.id)
  if (!petition) return res.status(404).send()
  if (!req.user.isPetitionsAdmin && petition.UserId !== req.user.id) return res.status(403).send()
  await petition.update(req.body)
  if (req.body.Tags) {
    if (!Array.isArray(req.body.Tags)) req.body.Tags = [req.body.Tags]
    await petition.setTags(req.body.Tags)
  } else {
    await petition.setTags([])
  }
  res.redirect('/app/petitions/'+petition.id)
}