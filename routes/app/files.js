const busboy = require('busboy')

const { FileStorage } = requiremain('./db/db')

module.exports = async (req, res) => {
  const file = await FileStorage.findByPk(req.params.id.split('.')[0])
  res.end(file.data)
}