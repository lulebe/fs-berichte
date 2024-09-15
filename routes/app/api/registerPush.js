const UAParser = require('ua-parser-js')
const { NotificationSubscription } = requiremain('./db/db')

module.exports = async (req, res) => {
  if (!req.body.endpoint) return res.status(400).send()
  let subscription = null
  subscription = await NotificationSubscription.findByPk(req.body.endpoint)
  if (!subscription)
    subscription = await NotificationSubscription.create({
      endpoint: req.body.endpoint,
      p256dh: req.body.keys.p256dh,
      auth: req.body.keys.auth,
      deviceName: parseDevice(req.headers['user-agent']),
      UserId: req.user.id
    })
  else
    subscription.update({deviceName: parseDevice(req.headers['user-agent'])})
  res.status(201).send()
}

function parseDevice (ua) {
  const parsed = UAParser(ua)
  return parsed.browser.name + ' ' + (parsed.os ? parsed.os.name + ' ' + parsed.os.version : '') + ' ' + (parsed.device ? parsed.device.vendor + ' ' + parsed.device.model : '')
}