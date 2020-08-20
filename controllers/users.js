const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
    const results = await User
        .find({})
        .populate('blogs', {
            title: 1,
            url: 1,
            likes: 1
        })
    res.json(results)
})

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body

    if (username.length < 3 || password.length < 3) {
        res.status(400).send({
            err: 'username and password\'s length must longer than 2'
        })
        return
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        username, name, passwordHash
    })

    const savedUser = await newUser.save()
    res.json(savedUser)
})

usersRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    await User.findByIdAndRemove(id)
    res.status(204).end()
})

module.exports = usersRouter
