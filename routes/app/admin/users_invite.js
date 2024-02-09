const jwt = require('jsonwebtoken')
const config = requiremain('./config')
const tmpl = requiremain('./templates')

const filename = require('path').parse(__filename).name

module.exports = async (req, res) => {
  const data = {
    a: req.query.awardsuser ? 1 : 0,
    p: req.query.petitionsuser ? 1 : 0,
    f: req.query.formsuser ? 1 : 0,
    r: req.query.reportsuser ? 1 : 0,
    d: req.query.duration
  }
  res.tmplOpts.inviteLink = config.ROOT_URL + '/invite?t=' + jwt.sign(data, config.JWT_SECRET, { expiresIn: '180 days' })
  res.tmplOpts.query = req.query
  res.tmplOpts.activeAdminTab = filename
  tmpl.render('app/admin/' + filename + '.twig', res.tmplOpts).then(rendered => res.end(rendered))
}