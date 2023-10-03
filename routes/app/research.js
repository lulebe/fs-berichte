const tmpl = requiremain('./templates')
const { getSetting, SETTINGS_KEYS } = requiremain('./db/stored_settings')
const { ResearchReport, User } = requiremain('./db/db')

const AREA_STRINGS = ["", "Grundlagenforschung", "klinisch-experimentell", "klinisch", "Literatur"]
const WORK_STRINGS = ["", "Doktorarbeit", "Praktikum", "HiWi-Job", "sonstiges"]
const DURATION_STRINGS = ["", "unter 4 Monate", "unter 9 Monate", "unter 1,5 Jahre", "mehr als 1,5 Jahre"]

module.exports = async (req, res) => {
  const report = await ResearchReport.findByPk(req.params.id, {include: [User]})
  if (!report) return res.status(404).send()
  const researchPublic = (await getSetting(SETTINGS_KEYS.RESEARCH_REPORTS_PUBLIC)) === '1'
  if (!researchPublic && report.User.id != req.user.id && !req.user.isAdmin) return res.redirect('/app/main')
  res.tmplOpts.reportDate = new Date(report.createdAt).toLocaleDateString('de-DE')
  res.tmplOpts.report = report
  res.tmplOpts.report.area = AREA_STRINGS[report.area]
  res.tmplOpts.report.work = WORK_STRINGS[report.work]
  res.tmplOpts.report.duration = DURATION_STRINGS[report.duration]
  tmpl.render('app/research.twig', res.tmplOpts).then(rendered => res.end(rendered))
}