const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const blogSchema = new mongoose.Schema({
    author: {
        type: String,
        minlength: 2,
        required: true
    },
    title: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true,
        validate: url => {
            return url.match(/^http/)
        }
    },
    likes: {
        type: Number,
        min: 0,
        required: true
    },
    user:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

blogSchema.plugin(uniqueValidator)

blogSchema.set('toJSON', {
    transform: (doc, returnObj) => {
        returnObj.id = returnObj._id.toString()
        delete returnObj._id
        delete returnObj.__v
    }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
