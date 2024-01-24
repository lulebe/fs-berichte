const tmpl = requiremain('./templates')

const { Award, AwardCandidate } = requiremain('./db/db')

module.exports = async (req, res) => {
  const award = await Award.findByPk(req.params.awardid)
  if (!award) return res.status(404).send()
  const candidate = await AwardCandidate.create({
    name: req.body.name,
    shortDescription: req.body.shortDescription,
    longDescription: req.body.longDescription,
    AwardId: award.id
  })
  return res.status(201).json(candidate)
}

//RETURNS JSON