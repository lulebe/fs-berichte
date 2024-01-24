const busboy = require('busboy')

const { CandidateImage } = requiremain('./db/db')

module.exports = async (req, res) => {
  const file = await CandidateImage.findByPk(req.params.filename.split('.')[0])
  res.end(file.data)
}