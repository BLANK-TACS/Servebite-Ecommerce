const express = require('express')
const {mssql, getPool} = require('../config/DBconnect')
const transporter = require('../config/mailer')
const authRouter = express.Router()

const isAuthenticated = (req, res, next) => {
    const user = req.session.user
    
    if(user) {
        if(user.typeID == 1) {
            return res.redirect('/protected/admin')
        }else {
            return res.redirect('/protected/user')
        }
    }
   next()
}

//login routes
authRouter.get('/login', isAuthenticated, (req, res) => {
    res.render('auth/login')
})

authRouter.delete('/logout', (req, res) => {
    delete req.session.user

    res.status(200).json({ message: 'Logged out', redirectUrl: '/auth/login' });
})

//signup routes
authRouter.get('/signup', isAuthenticated, (req, res) => {
    res.render('auth/signup')
})

authRouter.get('/forgot', isAuthenticated, (req, res) => {
    res.render('auth/reset')
})

authRouter.post('/login', isAuthenticated, async (req, res) => {
        try {
            const {username, password} = req.body
            const pool = await getPool()
    
            const query = `
            select * from tblUser
            where username = @username and password = @password
            `
            const result = await pool.request()
            .input('username', mssql.VarChar, username)
            .input('password', mssql.VarChar, password)
            .query(query)
            
            const user = result.recordset[0]
    
            if(!user) {
                req.flash('error_msg', 'Invalid credentials')
                return res.redirect('/auth/login')
            }
            req.session.user = user
            
            res.redirect('/protected/admin')
        } catch (error) {
            req.flash('error_msg', 'Server error')
            res.redirect('/auth/login') 
        }
})


authRouter.post('/signup', isAuthenticated, async (req, res) => {
    try {
        const { username, password, email} = req.body
        const pool = await getPool()

        const query = `
        insert into tblUser (username, password, typeID, email)
        values (@username, @password, @typeID, @email)`
        
        const result = await pool.request()
        .input('username', mssql.VarChar, username)
        .input('password', mssql.VarChar, password)
        .input('email', mssql.VarChar, email)
        .input('typeID', mssql.Int, 2)
        .query(query)

        req.flash('success_msg', 'Account created successfully')
        res.redirect('/auth/login')
    } catch (error) {
        req.flash('error_msg', 'Duplicate username/email.')
        res.redirect('/auth/signup')   
    }
})

authRouter.post('/forgot', isAuthenticated, async (req, res) => {
    const {username} = req.body
    try {
        const pool = await getPool()
        const query = `select email, password from tblUser where username = @username`

        const result = (await pool.request()
        .input('username', mssql.VarChar, username)
        .query(query)).recordset[0]

        if(!result) {
            return res.status(500).json({
                message: 'Username not found'
            })
        }
        
        const info = await transporter.sendMail({
            to: result.email,
            subject: 'Forgot Password',
            html: `
                <h2>Hi, ${username}</h2>
                <p>You requested that you forgot your password</p>
                <p>Here's your password: act</p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Thank you!</p>
            `
        })
        res.status(200).json({
            message: 'Password has been sent through email'
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = authRouter