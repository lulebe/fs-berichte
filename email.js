const nodemailer = require('nodemailer')

const config = require('./config')

const transporter = nodemailer.createTransport({
host: config.MAIL_HOST,
port: 465,
secure: true,
auth: {
  user: config.MAIL_USER,
  pass: config.MAIL_PASSWORD,
},
})

module.exports = async function (email, subject, text, html) {
  let mailStatus = await transporter.sendMail({
    from: config.MAIL_SENDER,
    to: email,
    subject,
    text: 'Hallo,\n\n' + text + '\n\nViele Grüße,\ndas FSmed Berichte Team',
    html: 'Hallo,<br><br>' + html + '<br><br>Viele Grüße,<br>das FSmed Berichte Team'
  })
  return mailStatus
}