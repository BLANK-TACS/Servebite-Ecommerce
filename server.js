require('dotenv').config()
const express = require('express')
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const app = express()

app.set('view engine', 'ejs')

//middleware
app.use(express.static('public'))
app.use(expressLayout)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(flash())
app.use('/node_modules', express.static(__dirname + '/node_modules'));


const sessionConfig = require('./config/session')
app.use(session(sessionConfig));

//custom middleware
const authenticate = require('./middleware/authenticate')
const layoutSwitcher = require('./middleware/layout-switch')

app.use(authenticate)
app.use(layoutSwitcher)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

//routes
const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')
const userRouter = require('./routes/user')
const guestRouter = require('./routes/guest')

app.use('/auth', authRouter)
app.use('/guest', guestRouter)
app.use('/protected/admin', adminRouter)
app.use('/protected/user', userRouter)

const port = 3000

app.listen(port)