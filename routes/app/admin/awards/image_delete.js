const {  CandidateImage } = requiremain('./db/db')

module.exports = async (req, res) => {
  const image = await CandidateImage.findByPk(req.params.id)
  await image.destroy()
  res.status(204).send()
}