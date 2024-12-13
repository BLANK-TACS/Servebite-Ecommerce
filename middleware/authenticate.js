module.exports = (req, res, next) => {
    const user = req.session.user
    const url = req.originalUrl

    if(!user) {
        if(url.startsWith('/protected')) {
            return res.redirect('/auth/login')
        }
    }  
    next()
}