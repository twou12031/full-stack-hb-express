require('dotenv').config()

let { PORT, MONGODB_URI, TEST_MONGODB_URI } = process.env

if (process.env.NODE_ENV === 'test') {
    MONGODB_URI = TEST_MONGODB_URI
}

module.exports = {
    PORT,
    MONGODB_URI
}
