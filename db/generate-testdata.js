const db = require('./db')
const bcrypt = require('bcryptjs')

const init = require('./init-db')
const config = require('../config')


const USER_COUNT = 100
const AWARD_COUNT = 1
const CANDIDATE_COUNT = 6

generateTestData()

async function generateTestData () {
  await init
  await generateTestUsers()
  await generateTestAwards()
}

async function generateTestUsers () {
  const password = bcrypt.hashSync("testpw", bcrypt.genSaltSync(config.SALT_ROUNDS))
  return Promise.all(Array.from(Array(USER_COUNT-1))
  .map((u, i) => ({email: `test${i}@${randomDomain()}`, password,  activated: true, authorized: true, isReportsUser: true, isAwardsUser: true, isPetitionsUser: true}))
  .map(userdata => db.User.create(userdata)))
}

function randomDomain () {
  return ['example.com', 'example.org'][Math.floor(Math.random() * 2)]
}

async function generateTestAwards () {
  return Promise.all(Array.from(Array(AWARD_COUNT)).map(_ => generateTestAward()))
}
async function generateTestAward () {
  const votingDeadline = new Date()
  votingDeadline.setMonth(votingDeadline.getMonth() + 1)
  const award = await db.Award.create({
    title: randomWords(3),
    description: randomWords(10),
    votingDeadline,
    status: db.Award.STATUS.PUBLISHED
  })
  const candidateIds = (await Promise.all(Array.from(Array(CANDIDATE_COUNT)).map(_ => ({
    AwardId: award.id,
    name: randomWords(2),
    shortDescription: randomWords(15),
    longDescription: randomWords(45)
  }))
  .map(candidateData => db.AwardCandidate.create(candidateData))))
  .map(candidate => candidate.id)
  for (let i = 1; i <= USER_COUNT; i++) {
    if (Math.random() > 0.7) continue
    await db.AwardVote.create({UserId: i, AwardId: award.id, AwardCandidateId: pickFrom(candidateIds)})
  }
}

function randomWords (count) {
  let s = ""
  for (let i = 0; i < count; i++) {
    s = s + ' ' + (Math.random() +1).toString(36).substring(7)
  }
  return s
}
function randomInt (min, max) {
  return Math.floor(Math.random() * (max-min+1) + min)
}
function pickFrom (arr) {
  return arr[randomInt(0, arr.length-1)]
}