const session = require('express-session')
const app = require('express')()

const config = require('./config')
const sessionStore = require('./db/db').sessionStore

var path = require('path')
global.appRoot = path.resolve(__dirname)
global.requiremain = require

app.use(
  session({
    secret: config.COOKIE_SECRET,
    store: sessionStore,
    resave: false,
    proxy: true,
    saveUninitialized: false,
    cookie: { secure: 'auto' }
  })
)

app.use(require('body-parser').urlencoded({extended: true}))
app.use(require('body-parser').json())

app.use('/', require('./routes'))
app.use('/assets', require('express').static('./assets', {maxAge: 10*60*60*1000}))


app.listen(config.PORT, () => {
  console.log("Lehre Server started on port", config.PORT)
})
