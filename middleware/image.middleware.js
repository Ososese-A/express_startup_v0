const imageMiddleware = (req, res, next) => {
    const  storageType = req.headers.image?.split(" ")[1]
    if (storageType === 'memory' || storageType === 'disk') {
        req.storageType = storageType
    } else {
        req.storageType = 'memory'
    }
    next()
}

module.exports = imageMiddleware