const { Sequelize, DataTypes } = require('sequelize')
const session = require('express-session')
const push = require('web-push')
const SequelizeStore = require("connect-session-sequelize")(session.Store)

const config = require('../config')

const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: config.DB_DIALECT,
  logging: config.production ? false : console.log
})

const sessionStore = new SequelizeStore({
  db: sequelize
})

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    set (val) {
      this.setDataValue('email', val.toLowerCase())
    },
    unique: true
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  activated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  authorized: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  authReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  awardsAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  petitionsAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  formsAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  moderator: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  isReportsUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  isFormsUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  isPetitionsUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  isAwardsUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  extendedUntil: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  createdAtReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.createdAt).toLocaleDateString('de-DE')
    }
  },
  displayName: {
    type: DataTypes.VIRTUAL,
    get () {
      return this.anonymous ? false : ((this.nickname != null) ? this.nickname : this.email.split('@')[0])
    }
  },
  isAwardsAdmin: {
    type: DataTypes.VIRTUAL,
    get () {
      return this.isAdmin || this.awardsAdmin
    }
  },
  isPetitionsAdmin: {
    type: DataTypes.VIRTUAL,
    get () {
      return this.isAdmin || this.petitionsAdmin
    }
  },
  isFormsAdmin: {
    type: DataTypes.VIRTUAL,
    get () {
      return this.isAdmin || this.formsAdmin
    }
  },
  isModerator: {
    type: DataTypes.VIRTUAL,
    get () {
      return this.isAdmin || this.moderator
    }
  },
  isAnyAdmin: {
    type: DataTypes.VIRTUAL,
    get () {
      return this.isAdmin || this.awardsAdmin || this.petitionsAdmin || this.formsAdmin || this.moderator
    }
  }
})
User.prototype.hasAuthorizedDomain = async function () {
  return this.isAdmin || this.email.endsWith(await Settings.get(Settings.KEYS.AUTHORIZED_DOMAIN))
}
User.prototype.activeUntil = async function () {
  if (this.extendedUntil) return new Date(this.extendedUntil)
  const activeUntil = new Date(this.createdAt)
  activeUntil.setFullYear(activeUntil.getFullYear() + await Settings.get(Settings.KEYS.USER_ACTIVE_DURATION))
  return activeUntil 
}
User.prototype.stillActive = async function () {
  return new Date() < await this.activeUntil()
}
User.prototype.activeUntilReadable = async function () {
  return (await this.activeUntil()).toLocaleDateString('de-DE')
}
User.prototype.notify = async function (title, text, url) {
  const subscriptions = await this.getNotificationSubscriptions()
  Promise.all(subscriptions.map(subscription => subscription.sendMessage(title, text, url)))
  .catch(e => {
    console.error(e.message)
  })
}
User.notifyWhere = async function (where, title, text, url) {
  const subscriptions = await NotificationSubscription.findAll({include: [{model: User, where}]})
  return Promise.all(subscriptions.map(subscription => subscription.sendMessage(title, text, url)))
  .catch(e => {
    console.log(e.message)
  })
}

//Notifications
const NotificationSubscription = sequelize.define('NotificationSubscription', {
  endpoint: {
    type: DataTypes.STRING(500),
    allowNull: false,
    primaryKey: true
  },
  p256dh: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  auth: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  timestamps: false
})
NotificationSubscription.prototype.sendMessage = async function (title, text, url) {
  //delete Subscription if user not active anymore
  if (!(await (await this.getUser()).stillActive())) {
    this.destroy()
    return
  }
  const sub = {
    endpoint: this.endpoint,
    keys: {
      p256dh: this.p256dh,
      auth: this.auth
    }
  }
  const payload = JSON.stringify({
    title, text, url
  })
  const vapidDetails = {
    subject: 'mailto:'+Settings.get(Settings.KEYS.ADMIN_EMAIL),
    privateKey: await Settings.get(Settings.KEYS.VAPID_PRIVATE_KEY),
    publicKey: await Settings.get(Settings.KEYS.VAPID_PUBLIC_KEY)
  }
  return push.sendNotification(sub, payload, {
    TTL: 60 * 60 * 24 * 7,
    vapidDetails
  })
  .catch(e => {
    if (e.statusCode === 410) //Gone = expired/unsubbed
      this.destroy()
    else throw e
  })
}

//Fach
const Subject = sequelize.define('Subject', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  createdAtReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.createdAt).toLocaleDateString('de-DE')
    }
  }
})

//Prüfer
const Examiner = sequelize.define('Examiner', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  createdAtReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.createdAt).toLocaleDateString('de-DE')
    }
  }
})

//Prüfungsort z.B. Klinikname
const ExamLocation = sequelize.define('ExamLocation', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  createdAtReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.createdAt).toLocaleDateString('de-DE')
    }
  }
})

//gesamte Prüfung
const Exam = sequelize.define('Exam', {
  date: DataTypes.DATE,
  dateReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.date).toLocaleDateString('de-DE')
    }
  },
  studentCount: DataTypes.INTEGER,
  grade: DataTypes.STRING,
  comment: DataTypes.TEXT('long')
})

//Physikum, M3 etc
const ExamType = sequelize.define('ExamType', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  subjectCount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAtReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.createdAt).toLocaleDateString('de-DE')
    }
  }
})

//Bericht über einzelnes Fach
const SubjectExam = sequelize.define('SubjectExam', {
  report: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  }
})

//Promotionsbericht
const AREA_STRINGS = ["", "Grundlagenforschung", "klinisch-experimentell", "klinisch", "Literatur"]
const WORK_STRINGS = ["", "Doktorarbeit", "Praktikum", "HiWi-Job", "sonstiges"]
const DURATION_STRINGS = ["", "unter 4 Monate", "unter 9 Monate", "unter 1,5 Jahre", "mehr als 1,5 Jahre"]
const RATING_STRINGS = ["", "Empfehlenswert", "Akzeptabel", "Fragwürdig", "Schlecht"]
const ResearchReport = sequelize.define('ResearchReport', {
  dateReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.createdAt).toLocaleDateString('de-DE')
    }
  },
  publishDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  publishDateReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.publishDate).toLocaleDateString('de-DE')
    }
  },
  isPublished: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.publishDate) <= new Date()
    }
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  head: {
    type: DataTypes.STRING,
    allowNull: false
  },
  supervisor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  areaReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return AREA_STRINGS[this.area]
    }
  },
  work: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  workReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return WORK_STRINGS[this.work]
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  durationReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return DURATION_STRINGS[this.duration]
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ratingReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return RATING_STRINGS[this.rating]
    }
  },
  timetext: DataTypes.TEXT,
  teamjournalclub: DataTypes.BOOLEAN,
  teamlabmeeting: DataTypes.BOOLEAN,
  teamjointwork: DataTypes.BOOLEAN,
  teamtext: DataTypes.TEXT,
  plan: DataTypes.INTEGER,
  plantext: DataTypes.TEXT,
  intro: DataTypes.INTEGER,
  help: DataTypes.INTEGER,
  helptext: DataTypes.TEXT,
  taskstext: DataTypes.TEXT,
  equipment: DataTypes.INTEGER,
  supportcash: DataTypes.BOOLEAN,
  supportstipendium: DataTypes.BOOLEAN,
  supportpublications: DataTypes.BOOLEAN,
  supportkongress: DataTypes.BOOLEAN,
  supporttext: DataTypes.TEXT,
  level: DataTypes.INTEGER,
  freedom: DataTypes.INTEGER,
  othertext: DataTypes.TEXT
})

//Petitionen
const PETITION_STATUS = {INACTIVE: 0, ACTIVE: 1, CLOSED: 2, FINISHED: 3, CANCELLED: 4}
const PETITION_STATUS_STRINGS = ["inaktiv", "aktiv", "in Bearbeitung", "abgeschlossen", "abgebrochen"]
const Petition = sequelize.define('Petitions', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recipient: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shortText: {
    type: DataTypes.STRING,
    allowNull: false
  },
  text: DataTypes.TEXT('long'),
  goal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 50
  },
  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  statusReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return PETITION_STATUS_STRINGS[this.status]
    }
  },
  dateReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.createdAt).toLocaleDateString('de-DE')
    }
  },
  deadlineReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.deadline).toLocaleDateString('de-DE')
    }
  },
  beforeDeadline: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.deadline) >= new Date()
    }
  }
})

//Tags
const Tag = sequelize.define('Tags', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

//Comments
const PetitionComment = sequelize.define('PetitionComments', {
  text: DataTypes.TEXT,
  dateReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.createdAt).toLocaleDateString('de-DE')
    }
  }
})

//Umfragen
const Form = sequelize.define('Forms', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  embedCode: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dateReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.createdAt).toLocaleDateString('de-DE')
    }
  }
})

//Awards
const Award = sequelize.define('Awards', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    set (val) {
      if (Object.values(Award.STATUS).includes(val))
        this.setDataValue('status', val)
      else
        throw new Error("invalid status to be set on Award " + this.id)
    }
  },
  statusReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return Award.STATUS_READABLE[this.status]
    }
  },
  shuffleCandidates: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  votingDeadline: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  votingDeadlineReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.votingDeadline).toLocaleDateString('de-DE')
    }
  },
  beforeDeadline: {
    type: DataTypes.VIRTUAL,
    get () {
      const date = new Date()
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)
      return new Date(this.votingDeadline) >= date
    }
  },
  canVote: {
    type: DataTypes.VIRTUAL,
    get () {
      return this.beforeDeadline && this.status === Award.STATUS.PUBLISHED
    }
  }
})
Award.STATUS = Object.freeze({UNPUBLISHED: 0, PUBLISHED: 1, DONE: 2})
Award.STATUS_READABLE = ["Unveröffentlicht", "Veröffentlicht", "Abgeschlossen"]

const AwardCandidate = sequelize.define('AwardCandidates', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: DataTypes.INTEGER,
  shortDescription: {
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  longDescription: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  }
})
const CandidateImage = sequelize.define('CandidateImages', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.BLOB('long'),
    allowNull: false
  }
})


const AwardVote = sequelize.define('AwardVotes', {}, {
  indexes: [
    {unique: true, fields: ['UserId', 'AwardId']}
  ]
})

//Einstellungen
const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false
  },
  value: {
    type: DataTypes.STRING(4000),
    allowNull: false
  },
  readableKey: {
    type: DataTypes.VIRTUAL,
    get () {
      return Settings.READABLE_KEYS[this.id]
    }
  }
}, {timestamps: false})
Settings.KEYS = {
  RESEARCH_REPORTS_PUBLIC: 1,
  PETITIONS_REQUIRE_ADMIN_CONFIRMATION: 2,
  PETITION_HOW_TO: 3,
  AWARD_DESCRIPTION: 4,
  LOGIN_DESCRIPTION: 5,
  LOGIN_REGISTER_EXPLAINER: 6,
  USER_ACTIVE_DURATION: 7,
  AUTHORIZED_DOMAIN: 8,
  VAPID_PUBLIC_KEY: 9,
  VAPID_PRIVATE_KEY: 10,
  ADMIN_EMAIL: 11,
  MAIL_HOST: 12,
  MAIL_USER: 13,
  MAIL_PASSWORD: 14,
  MAIL_SENDER: 15,
  ROOT_URL: 16,
  COOKIE_SECRET: 17,
  JWT_SECRET: 18
}
Settings.READABLE_KEYS = {
  [Settings.KEYS.RESEARCH_REPORTS_PUBLIC]: "Promotionsberichte einsehbar",
  [Settings.KEYS.PETITIONS_REQUIRE_ADMIN_CONFIRMATION]: "Petitionen benötigen Admin-Freigabe",
  [Settings.KEYS.PETITION_HOW_TO]: "Anleitung für die Erstellung von Petitionen",
  [Settings.KEYS.AWARD_DESCRIPTION]: "Erklärungstext bei PaLMe",
  [Settings.KEYS.LOGIN_DESCRIPTION]: "Beschreibung der Website auf der Login-Seite",
  [Settings.KEYS.LOGIN_REGISTER_EXPLAINER]: "Text, der im Registrierungsformular angezeigt wird",
  [Settings.KEYS.USER_ACTIVE_DURATION]: "Dauer bis Nutzer erneut aktiviert müssen (Jahre)",
  [Settings.KEYS.AUTHORIZED_DOMAIN]: "erlaubte E-Mail Domain",
  [Settings.KEYS.VAPID_PUBLIC_KEY]: "VAPID public key (für Notifications)",
  [Settings.KEYS.VAPID_PRIVATE_KEY]: "VAPID private key (für Notifications)",
  [Settings.KEYS.ADMIN_EMAIL]: "E-Mail-Adresse von Admins",
  [Settings.KEYS.MAIL_HOST]: "E-Mail-Host",
  [Settings.KEYS.MAIL_USER]: "E-Mail-User",
  [Settings.KEYS.MAIL_PASSWORD]: "E-Mail-Passwort",
  [Settings.KEYS.MAIL_SENDER]: "E-Mail-Absender",
  [Settings.KEYS.ROOT_URL]: "Root URL",
  [Settings.KEYS.COOKIE_SECRET]: "Cookie Secret (restart required)",
  [Settings.KEYS.JWT_SECRET]: "JWT Secret"
}
Settings.cache = {}
Settings.get = async function (key) {
  if (!Settings.cache.hasOwnProperty(key))
    (await Settings.findAll()).forEach(entry => {Settings.cache[entry.id] = !isNaN(entry.value) && !isNaN(parseInt(entry.value)) ? parseInt(entry.value) : entry.value})
  if (!Settings.cache.hasOwnProperty(key)) throw new Error("Key not in DB")
  return Settings.cache[key]
}
Settings.set = async function (key, value) {
  const cappedValue = value && value.length && value.length > 4000 ? value.substring(0, 4000) : value
  const entry = await Settings.upsert({id: key, value: cappedValue})
  Settings.cache[key] = !isNaN(cappedValue) && !isNaN(parseInt(entry.value)) ? parseInt(cappedValue) : cappedValue
  return entry
}

User.hasMany(NotificationSubscription,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
NotificationSubscription.belongsTo(User)

User.hasMany(Exam,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
Exam.belongsTo(User)

Exam.hasMany(SubjectExam,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
SubjectExam.belongsTo(Exam)

ExamType.hasMany(Exam,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
Exam.belongsTo(ExamType)

ExamLocation.hasMany(Exam)
Exam.belongsTo(ExamLocation)

Subject.hasMany(SubjectExam,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
SubjectExam.belongsTo(Subject)

Examiner.hasMany(SubjectExam,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
SubjectExam.belongsTo(Examiner)

User.hasMany(ResearchReport,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
ResearchReport.belongsTo(User)

User.hasMany(Petition,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
Petition.belongsTo(User)
User.hasMany(PetitionComment,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
PetitionComment.belongsTo(User)
Petition.hasMany(PetitionComment)
PetitionComment.belongsTo(Petition)
Petition.belongsToMany(Tag, {
  through: 'PetitionTags'
})
Tag.belongsToMany(Petition, {
  through: 'PetitionTags'
})
Petition.belongsToMany(User, {
  through: 'PetitionSupporters',
  as: 'Supporters'
})
User.belongsToMany(Petition, {
  through: 'PetitionSupporters',
  as: 'SupportedPetitions'
})

Award.hasMany(AwardCandidate,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
AwardCandidate.belongsTo(Award)
AwardCandidate.hasMany(CandidateImage,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
CandidateImage.belongsTo(AwardCandidate)
User.hasMany(AwardVote,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
AwardVote.belongsTo(User)
Award.hasMany(AwardVote,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
AwardVote.belongsTo(Award)
AwardCandidate.hasMany(AwardVote,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
AwardVote.belongsTo(AwardCandidate)

async function init () {
  return await sequelize.sync({force: true})
}
module.exports = { init, User, NotificationSubscription, ExamType, Exam, SubjectExam, ExamLocation, Examiner, Subject, ResearchReport, Petition, Tag, PetitionComment, Form, Award, AwardCandidate, CandidateImage, AwardVote, Settings, PETITION_STATUS, PETITION_STATUS_STRINGS, sessionStore }
