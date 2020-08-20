const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
    const result = await Blog
        .find({})
        .populate('user', {
            username: 1,
            name: 1
        })
    res.json(result)
})


blogsRouter.post('/', async (req, res) => {
    const { token, body } = req
    const { author, title, url, likes } = body

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({
            err: 'token missing or invalid'
        })
    }

    const user = await User.findById(decodedToken.id)

    const newBlog = new Blog({
        author,
        title,
        url,
        likes: likes || 0,
        user: user._id
    })

    if (!title || !url) {
        res.status(400).end()
        return
    }

    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
    const { token, params } = req

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({
            err: 'token missing or invalid'
        })
    }

    const user = await User.findById(decodedToken.id)

    const { id } = params
    const blog = await Blog.findById(id)
    if (blog.user.toString() === user._id.toString()) {
        await Blog.findByIdAndRemove(id)
        res.status(204).end()
    }
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
