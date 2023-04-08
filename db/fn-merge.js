const { SubjectExam, Exam } = require('./db')

async function mergeExaminer (fromId, toId) {
  await SubjectExam.update({'ExaminerId': toId}, {where: {'ExaminerId': fromId}})
}

async function mergeSubject (fromId, toId) {
  await SubjectExam.update({'SubjectId': toId}, {where: {'SubjectId': fromId}})
}

async function mergeExamLocation (fromId, toId) {
  await Exam.update({'ExamLocationId': toId}, {Where: {'ExamLocationId': fromId}})
}

module.exports = { mergeExaminer, mergeSubject, mergeExamLocation }