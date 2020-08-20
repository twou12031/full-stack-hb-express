const logger = require('./logger')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:', req.path)
    logger.info('Body:', req.body)
    logger.info('@requestLogger end')
    next()
}

const tokenFormater = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        req.token = authorization.substr(7)
    }
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({
        err: '@unknown endpoint'
    })
}

const errorHandler = (err, req, res, next) => {
    logger.error(err.message)

    const { name } = err

    if (name === 'CastError') {
        return res.status(400).send({
            err: '@illegal id'
        })
    }

    if (name === 'ValidationError') {
        return res.status(400).send({
            err: err.message
        })
    }

    if (name === 'JsonWebTokenError') {
        return res.status(401).send({
            err: 'invalid token'
        })
    }
    next(err)
}

module.exports = {
    requestLogger,
    tokenFormater,
    unknownEndpoint,
    errorHandler
}
