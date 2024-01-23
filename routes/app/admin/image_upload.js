const busboy = require('busboy')

const { FileStorage } = requiremain('./db/db')

module.exports = async (req, res) => {
  const bb = busboy({ headers: req.headers, limits: {fileSize: 3 * 1024 * 1024, files: 1} })
  let fileBuffer = null
  let filename = null
  bb.on('file', (name, file, info) => {
    console.log(info)
    filename = info.filename
    const bufArr = []
    file.on('data', (data) => {
      bufArr.push(data)
    }).on('close', () => {
      fileBuffer = Buffer.concat(bufArr)
    })
  })
  bb.on('field', (name, val, info) => {
    console.log(`Field [${name}]: value: %j`, val)
  })
  bb.on('close', () => {
    console.log('Done parsing form!')
    saveAndRespond(req, res, fileBuffer, filename)
  })
  req.pipe(bb)
}

async function saveAndRespond(req, res, fileBuffer, filename) {
  const file = await FileStorage.create({
    name: filename,
    data: fileBuffer
  })
  res.status(200).json({data: {filePath: `app/files/${file.id + '.' + filename.split('.').pop()}`}})
}