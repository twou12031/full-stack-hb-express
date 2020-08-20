const logger = require('./logger')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:', req.path)
    logger.info('Body:', req.body)
    logger.info('@requestLogger end')
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
    next(err)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}
