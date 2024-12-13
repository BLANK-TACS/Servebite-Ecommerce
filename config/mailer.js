const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.APP_NAME,
        pass: process.env.APP_PASSWORD
    }
})

module.exports = transporter