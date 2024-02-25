const nodemailer = require('nodemailer')

const { Settings } = require('./db/db')

const transporter = new Promise(async (resolve, reject) => {
  const transport = await nodemailer.createTransport({
    host: await Settings.get(Settings.KEYS.MAIL_HOST),
    port: 465,
    secure: true,
    auth: {
      user: await Settings.get(Settings.KEYS.MAIL_USER),
      pass: await Settings.get(Settings.KEYS.MAIL_PASSWORD),
    },
  })
  resolve(transport)
})

module.exports = async function (email, subject, text, html) {
  const transport = await transporter
  if ((await Settings.get(Settings.KEYS.MAIL_PASSWORD)) == "testpw") {
    console.log(email, subject, text)
    return true
  }
  try {
    let mailStatus = await transport.sendMail({
      from: await Settings.get(Settings.KEYS.MAIL_SENDER),
      to: email,
      subject,
      text: 'Hallo,\n\n' + text + '\n\nViele Grüße,\ndas Fachschaftsteam Lehre',
      html: 'Hallo,<br><br>' + html + '<br><br>Viele Grüße,<br>das Fachschaftsteam Lehre'
    })
    return mailStatus
  } catch (e) {
    return e
  }
}