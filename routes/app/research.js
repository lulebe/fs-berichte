const Cookies = require('cookies')

const tmpl = requiremain('./templates')
const { ResearchReport, User, Settings } = requiremain('./db/db')

module.exports = async (req, res) => {
  const report = await ResearchReport.findByPk(req.params.id, {include: [User]})
  if (!report) return res.redirect('/app/research')
  const researchPublic = !!(await Settings.get(Settings.KEYS.RESEARCH_REPORTS_PUBLIC))
  if ((!researchPublic || !report.isPublished) && report.User.id != req.user.id && !req.user.isModerator) return res.redirect('/app/research')
  const cookies = new Cookies(req, res)
  let cookie = [req.params.id, ...(cookies.get('researchs') ? cookies.get('researchs').split(',') : [])]
  cookie = [...new Set(cookie)].slice(-5).join(',')
  cookies.set('researchs', cookie, {maxAge: 100 * 24 * 60 * 60 * 1000})
  res.tmplOpts.report = report
  tmpl.render('app/research.twig', res.tmplOpts).then(rendered => res.end(rendered))
}