const mailer = requiremain('./email')

module.exports = async (req, res) => {
  try {
    const data = await mailer("cotida7454@giratex.com", "test", "testtext", "testtext<b>fett</b>")
    res.status(200).send(data)
  } catch (err) {
    res.status(200).send(err.message)
  
}