const personsRouter = require('express').Router()

const Person = require('../models/person')

personsRouter.get('/', async (req, res) => {
    // console.log(req)
    const persons = await Person.find({})
    res.json(persons)
})

personsRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    const person = await Person.findById(id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

personsRouter.post('/', async (req, res) => {
    const { name, number } = req.body

    const newPerson = new Person({
        name,
        number
    })
    const savedPerson = await newPerson.save()
    res.json(savedPerson)
})

personsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    await Person.findByIdAndRemove(id)
    res.status(204).end()
})

personsRouter.put('/:id', async (req, res) => {
    const{ id } = req.params
    const { name, number } = req.body

    const updatePerson = {
        name,
        number
    }

    const result = await Person
        .findByIdAndUpdate(id, updatePerson, {
            new: true
        })
    res.json(result)
})

module.exports = personsRouter
