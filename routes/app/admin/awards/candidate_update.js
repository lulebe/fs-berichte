const tmpl = requiremain('./templates')

const { AwardCandidate, CandidateImage } = requiremain('./db/db')

module.exports = async (req, res) => {
  const candidate = await AwardCandidate.findByPk(req.params.candidateid, {include: [{model: CandidateImage, attributes: ['id', 'type']}]})
  if (!candidate) return res.status(404).send()
  if (req.body.name) candidate.name = req.body.name
  if (req.body.shortDescription) candidate.shortDescription = req.body.shortDescription
  if (req.body.longDescription) candidate.longDescription = req.body.longDescription
  try {
    await candidate.save()
  } catch (e) {
    return res.status(500).send(e.message)
  }
  return res.status(200).send(candidate)
}

//RETURNS JSON