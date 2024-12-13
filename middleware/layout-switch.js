module.exports = (req, res, next) => {
    const url = req.originalUrl

    if(url.startsWith('/protected/admin')) {
        res.locals.layout = './layouts/admin'
    }else if(url.startsWith('/protected/user')) {
        res.locals.layout = './layouts/user'
    }else if(url.startsWith('/guest')) {
        res.locals.layout = './layouts/guest'
    }else {
        res.locals.layout = './layouts/auth'
    }
    
    next()
}