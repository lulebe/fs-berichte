const Cookies = require('cookies')

const tmpl = requiremain('./templates')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const { Settings, Award, AwardCandidate, Exam, SubjectExam, ExamType, Subject, Examiner, ExamLocation, ResearchReport, Form, Petition, PETITION_STATUS } = requiremain('./db/db')

module.exports = async (req, res) => {
  const cookies = new Cookies(req, res)

  //reports
  const exams = req.user.isReportsUser ? (await getExams(cookieToArray('exams', cookies))).map(e => ({type: 'exam', data: e})) : []
  let researchReports = []
  if (req.user.isModerator || (req.user.isReportsUser && !!(await Settings.get(Settings.KEYS.RESEARCH_REPORTS_PUBLIC))))
    researchReports = await getResearchReports(cookieToArray('researchs', cookies))
  researchReports = researchReports.map(r => ({type: 'research', data: r}))
  
  //petitions
  const petitions = req.user.isPetitionsUser ? (await Petition.findAll({
    where: {[Op.and]: [{ status: {[Op.gte]: req.user.isPetitionsAdmin ? 0 : 1 } }, { status: {[Op.lte]: 1 } } ]},
    order: [['createdAt', 'DESC']]
  })).map(p => ({type: 'petitions', data: p})) : []
  await Promise.all(petitions.map(async (p) => {
    p.data.isSupporting = await p.data.hasSupporter(req.user)
    const count = await p.data.countSupporters()
    p.data.supporterCount = count
    p.data.percentage = Math.floor(count / p.data.goal * 100)
    p.data.isActive =p.data.status === PETITION_STATUS.ACTIVE && p.data.beforeDeadline
  }))

  //awards
  const awards = req.user.isAwardsUser ? (await Award.findAll({
    where: {status:  Award.STATUS.PUBLISHED},
    include: [{model: AwardCandidate, attributes: ['id', 'name']}],
    order: [['createdAt', 'DESC']]
  })).map(a => ({type: 'awards', data: a})) : []

  //forms
  const forms = req.user.isFormsUser ? (await Form.findAll({order: [['id', 'DESC']]})).map(f => ({type: 'forms', data: f})) : []

  const reports = [...exams, ...researchReports].sort(() => 0.5 - Math.random())
  res.tmplOpts.results = [...awards, ...petitions, ...forms, ...reports]
  const notificationAllowedAreas = []
  if (req.user.isPetitionsUser) notificationAllowedAreas.push('Petitionen')
  if (req.user.isFormsUser) notificationAllowedAreas.push('Umfragen')
  if (req.user.isAwardsUser) notificationAllowedAreas.push('PaLMe')
  res.tmplOpts.notificationAllowedAreas = notificationAllowedAreas.slice(0, -1).join(', ') + (notificationAllowedAreas.length > 1 ? ' und ' : '') + notificationAllowedAreas.slice(-1)
  res.tmplOpts.vapidPublicKey = await Settings.get(Settings.KEYS.VAPID_PUBLIC_KEY)
  tmpl.render('app/main.twig', res.tmplOpts).then(rendered => res.end(rendered))
}

function cookieToArray (name, cookies) {
  return cookies.get(name) ? cookies.get(name).split(',') : []
}

async function getExams (visited) {
  //1. get visited exams
  const visitedExams = await Exam.findAll({where: {id: visited}, include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation, ExamType]})
  //2. get up to 7 random exams
  let randomExams = []
  let compareDate = new Date()
  compareDate.setFullYear(compareDate.getFullYear() - 2)
  if (visited.length < 7)
    randomExams = await Exam.findAll({where: {date: {[Op.gte]: compareDate}}, include: [{model: SubjectExam, include: [Subject, Examiner]}, ExamLocation, ExamType], order: Sequelize.literal('rand()'), limit: (7 - visited.length)})
  //3. combine
  return [...visitedExams, ...randomExams]
}

async function getResearchReports (visited) {
  //1. get visited reports
  const visitedReports = await ResearchReport.findAll({where: {id: visited}})
  //2. get up to 4 random reports
  let randomReports = []
  if (visited.length < 4)
    randomReports = await ResearchReport.findAll({where: {publishDate: {[Op.lte]: new Date()}}, order: Sequelize.literal('rand()'), limit: (4 - visited.length)})
  //3. combine
  return [...visitedReports, ...randomReports]
}