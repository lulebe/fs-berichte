const bcrypt = require('bcryptjs')

const { User } = require.main.require('./db/db')

module.exports = async (req, res) => {
  if (!req.body.email)
    return res.redirect('/?status=1')
  const foundUser = await User.findOne({where: {email: req.body.email.toLowerCase()}})
  if (!foundUser)
    return res.redirect('/?status=4')
  const result = await bcrypt.compare(req.body.password, foundUser.password)
  if (!result)
    return res.redirect('/?status=4')
  if (!foundUser.activated)
    return res.redirect('/?status=6')
  req.session.userId = foundUser.id
  req.session.isAdmin = foundUser.isAdmin
  if (req.query.goto)
    res.redirect(req.query.goto)
  else
    res.redirect('/app/main')
}