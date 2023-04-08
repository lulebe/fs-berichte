const { Sequelize, DataTypes } = require('sequelize')
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
    }
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
    allowNull: false
  }
})

//Prüfer
const Examiner = sequelize.define('Examiner', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

//Prüfungsort z.B. Klinikname
const ExamLocation = sequelize.define('ExamLocation', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

//gesamte Prüfung
const Exam = sequelize.define('Exam', {
  date: DataTypes.DATE,
  studentCount: DataTypes.INTEGER
})

//Physikum, M3 etc
const ExamType = sequelize.define('ExamType', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subjectCount: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

//Bericht über einzelnes Fach
const SubjectExam = sequelize.define('SubjectExam', {
  report: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})

User.hasMany(Exam,
  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  }
)
Exam.hasOne(User)

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

async function init () {
  return await sequelize.sync({force: true})
}
module.exports = { init, User, ExamType, Exam, SubjectExam, ExamLocation, Examiner, Subject, sessionStore }
