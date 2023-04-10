module.exports = async (req, res) => {
  if (req.body.doit !== "yes") return res.status(400).send()
  await req.user.destroy()
  req.session.destroy()
  res.redirect('/')
}