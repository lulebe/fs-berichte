const {  AwardCandidate } = requiremain('./db/db')

module.exports = async (req, res) => {
  const candidate = await AwardCandidate.findByPk(req.params.candidateid)
  await candidate.destroy()
  res.redirect('/app/admin/awards/'+req.params.awardid)
}