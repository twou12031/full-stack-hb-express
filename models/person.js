const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
//for warning `findOneAndUpdate()` and `findOneAndDelete()`
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(res => {
        if (res) {
            console.log('@connect sucessed')
        }
    }).catch(err => {
        console.log('@connect failed', err.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    number: {
        type: Number,
        validate: number => {
            return number.toString().length >= 8
        },
        required: true
    }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (doc, returnObj) => {
        returnObj.id = returnObj._id.toString()
        delete returnObj._id
        delete returnObj.__v
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
