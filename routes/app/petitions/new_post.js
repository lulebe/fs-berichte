const { Petition } = requiremain('./db/db')

module.exports = async (req, res) => {
  req.body.UserId = req.user.id
  req.body.status = 0
  const petition = await Petition.create(req.body)
  if (req.body.Tags) {
    if (!Array.isArray(req.body.Tags)) req.body.Tags = [req.body.Tags]
    await petition.setTags(req.body.Tags)
  }
  res.redirect('/app/petitions/'+petition.id)
}