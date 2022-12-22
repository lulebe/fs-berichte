const session = require('express-session')
const app = require('express')()
const nunjucks = require('nunjucks')

const config = require('./config')
const sessionStore = require('./db').sessionStore

var path = require('path')
global.appRoot = path.resolve(__dirname)

nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

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

app.use('/', require('./routes'))
app.use('/assets', require('express').static('./assets'))


app.listen(config.PORT, () => {
  console.log("Berichte Server started on port", config.PORT)
})
