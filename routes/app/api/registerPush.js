const { NotificationSubscription } = requiremain('./db/db')

module.exports = async (req, res) => {
  if (!req.body.endpoint) return res.status(400).send()
  let subscription = null
  subscription = await NotificationSubscription.findByPk(req.body.endpoint)
  if (!subscription)
    subscription = await NotificationSubscription.create({endpoint: req.body.endpoint, p256dh: req.body.keys.p256dh, auth: req.body.keys.auth, UserId: req.user.id})
  res.status(201).send()
}