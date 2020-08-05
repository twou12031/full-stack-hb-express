const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

blogsRouter.get('/', (req, res) => {
    // console.log(req)
    Blog.find({}).then(result => {
        res.json(result)
    })
})


blogsRouter.post('/', (req, res, next) => {
    const { author, title, url, likes } = req.body

    const newBlog = new Blog({
        author,
        title,
        url,
        likes
    })

    newBlog.save().then(result => {
        res.json(result)
    }).catch(err => {
        next(err)
    })
})


module.exports = blogsRouter
