const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
    // console.log(req)
    const result = await Blog.find({})
    res.json(result)
})


blogsRouter.post('/', async (req, res) => {
    const { author, title, url, likes } = req.body

    const newBlog = new Blog({
        author,
        title,
        url,
        likes: likes || 0
    })
    if (!title || !url) {
        res.status(400).end()
        return
    }
    const savedBlog = await newBlog.save()
    res.json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    await Blog.findByIdAndRemove(id)
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const{ id } = req.params
    const { likes } = req.body

    const updatePerson = {
        likes
    }

    const result = await Blog
        .findByIdAndUpdate(id, updatePerson, {
            new: true
        })
    res.json(result)
})


module.exports = blogsRouter
