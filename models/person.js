const mongoose = require('mongoose')

//for warning `findOneAndUpdate()` and `findOneAndDelete()`
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        console.log('@connect sucessed')
    }).catch(err => {
        console.log('@connect failed', err.message)
    })

const personSchema = new mongoose.Schema({
        name: String,
        number: Number
    })

personSchema.set('toJSON', {
    transform: (doc, returnObj) => {
        returnObj.id = returnObj._id.toString()
        delete returnObj._id
        delete returnObj.__v
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
