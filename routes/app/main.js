const Cookies = require('cookies')

const tmpl = requiremain('./templates')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const { Exam, SubjectExam, ExamType, Subject, Examiner, ExamLocation, ResearchReport, Form, Petition } = requiremain('./db/db')
const { getSetting, SETTINGS_KEYS } = requiremain('./db/stored_settings')

module.exports = async (req, res) => {
  const cookies = new Cookies(req, res)

  //reports
  const exams = (await getExams(cookieToArray('exams', cookies))).map(e => ({type: 'exam', data: e}))
  let researchReports = []
  if (req.user.isAdmin || (await getSetting(SETTINGS_KEYS.RESEARCH_REPORTS_PUBLIC)) === '1')
    researchReports = await getResearchReports(cookieToArray('researchs', cookies))
  researchReports = researchReports.map(r => ({type: 'research', data: r}))
  
  //petitions
  const petitions = (await Petition.findAll({
    where: {[Op.and]: [{ status: {[Op.gte]: req.user.isAdmin ? 0 : 1 } }, { status: {[Op.lte]: 3 } } ]},
    order: [['id', 'DESC']]
  })).map(p => ({type: 'petitions', data: p}))

  //forms
  const forms = (await Form.findAll({order: [['id', 'DESC']]})).map(f => ({type: 'forms', data: f}))

  let results = [...petitions, ...forms, ...exams, ...researchReports].sort(() => 0.5 - Math.random())
  res.tmplOpts.results = results
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