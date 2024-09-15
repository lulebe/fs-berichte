const UAParser = require('ua-parser-js')
const { NotificationSubscription } = requiremain('./db/db')

module.exports = async (req, res) => {
  if (req.body.endpoint) {
    let subscription = null
    subscription = await NotificationSubscription.findByPk(req.body.endpoint)
    subscription && subscription.destroy()
  } else {
    req.user.removeNotificationSubscriptions()
  }
  res.status(201).send()
}