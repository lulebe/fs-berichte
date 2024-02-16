const { Petition, Settings } = requiremain('./db/db')
const { User } = requiremain('./db/db')
const mailer = requiremain('./email')

module.exports = async (req, res) => {
  req.body.UserId = req.user.id
  req.body.status = 0
  const petition = await Petition.create(req.body)
  if (req.body.Tags) {
    if (!Array.isArray(req.body.Tags)) req.body.Tags = [req.body.Tags]
    await petition.setTags(req.body.Tags)
  }
  if (!req.user.isPetitionsAdmin && !!(await Settings.get(Settings.KEYS.PETITIONS_REQUIRE_ADMIN_CONFIRMATION))) notifyAdmin(petition)
  res.redirect('/app/petitions/'+petition.id)
}

async function notifyAdmin(petition) {
  return mailer(
    await Settings.get(Settings.KEYS.ADMIN_EMAIL),
    'Neue Petition',
    `Die Petition ${petition.title} wurde erstellt. Überprüfe sie und schalte sie frei unter:\n${config.ROOT_URL}/app/petitions/${petition.id}.`,
    `Die Petition ${petition.title} wurde erstellt. Überprüfe sie und schalte sie frei unter:<br><a href="${config.ROOT_URL}/app/petitions/${petition.id}">${config.ROOT_URL}/app/petitions/${petition.id}</a>.`
  )
}