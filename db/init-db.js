const db = require('./db')
const bcrypt = require('bcryptjs')
const config = require('../config')

db.init().then(() => {
    const password = bcrypt.hashSync("testpw", bcrypt.genSaltSync(config.SALT_ROUNDS))
    db.User.create({email: "test@example.com", activated: true, authorized: true, isAdmin: true, password})
    .then(() => {
        console.log('DB initialized, PLEASE REMOVE TESTUSER')
    })
})
