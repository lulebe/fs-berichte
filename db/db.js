const { Sequelize, DataTypes, STRING } = require('sequelize')
const session = require('express-session')
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
  }
})

//Fach
const Subject = sequelize.define('Subject', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
})

//Prüfer
const Examiner = sequelize.define('Examiner', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
})

//Prüfungsort z.B. Klinikname
const ExamLocation = sequelize.define('ExamLocation', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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
const ResearchReport = sequelize.define('ResearchReport', {
  dateReadable: {
    type: DataTypes.VIRTUAL,
    get () {
      return new Date(this.createdAt).toLocaleDateString('de-DE')
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

//Einstellungen
const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {timestamps: false})

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

async function init () {
  return await sequelize.sync({force: true})
}
module.exports = { init, User, ExamType, Exam, SubjectExam, ExamLocation, Examiner, Subject, ResearchReport, Settings, sessionStore }
