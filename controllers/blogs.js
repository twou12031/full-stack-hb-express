const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
    // console.log(req)
    const result = await Blog
        .find({})
        .populate('user', {
            username: 1,
            name: 1
        })
    res.json(result)
})


blogsRouter.post('/', async (req, res) => {
    const { author, title, url, likes, userId } = req.body


    if (!userId) {
        res.status(400).end()
        return
    }

    const user = await User.findById(userId)

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
