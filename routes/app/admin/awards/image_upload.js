const busboy = require('busboy')

const { AwardCandidate, CandidateImage } = requiremain('./db/db')

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
    saveAndRespond(req, res, fileBuffer, filename)
  })
  req.pipe(bb)
}

async function saveAndRespond(req, res, fileBuffer, filename) {
  const candidate = await AwardCandidate.findByPk(req.params.candidateid)
  if (!candidate) return res.status(404).send()
  const file = await CandidateImage.create({
    type: filename.split('.').pop(),
    data: fileBuffer,
    AwardCandidateId: candidate.id
  })
  res.status(200).json({data: {filePath: `/app/awards/image/${file.id + '.' + filename.split('.').pop()}`}})
}