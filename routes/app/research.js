const Cookies = require('cookies')

const tmpl = requiremain('./templates')
const { getSetting, SETTINGS_KEYS } = requiremain('./db/stored_settings')
const { ResearchReport, User } = requiremain('./db/db')

module.exports = async (req, res) => {
  const report = await ResearchReport.findByPk(req.params.id, {include: [User]})
  if (!report) return res.status(404).send()
  const researchPublic = (await getSetting(SETTINGS_KEYS.RESEARCH_REPORTS_PUBLIC)) === '1'
  if ((!researchPublic || !report.isPublished) && report.User.id != req.user.id && !req.user.isAdmin) return res.redirect('/app/research')
  const cookies = new Cookies(req, res)
  let cookie = [req.params.id, ...(cookies.get('researchs') ? cookies.get('researchs').split(',') : [])]
  cookie = [...new Set(cookie)].slice(-5).join(',')
  cookies.set('researchs', cookie, {maxAge: 100 * 24 * 60 * 60 * 1000})
  res.tmplOpts.report = report
  tmpl.render('app/research.twig', res.tmplOpts).then(rendered => res.end(rendered))
}