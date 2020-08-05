const personsRouter = require('express').Router()

const Person = require('../models/person')

personsRouter.get('/', (req, res) => {
    console.log(req)
    Person.find({}).then(result => {
        res.json(result)
    })
})

personsRouter.get(':/id', (req, res, next) => {
    const { id } = req.params
    Person.findById(id).then(result => {
        if (result) {
            res.json(result)
        } else {
            res.status(404).end()
        }
    }).catch(err => {
        next(err)
    })
})

personsRouter.post('/', (req, res, next) => {
    const { name, number } = req.body

    const newPerson = new Person({
        name,
        number
    })

    newPerson.save().then(result => {
        res.json(result)
    }).catch(err => {
        next(err)
    })
})

personsRouter.delete(':/id', (req, res, next) => {
    const { id } = req.params
    Person.findByIdAndRemove(id).then(() => {
        res.status(204).end()
    }).catch(err => {
        next(err)
    })
})

personsRouter.put(':/id', (req, res, next) => {
    const{ id } = req.params
    const { name, number } = req.body

    const updatePerson = {
        name,
        number
    }

    Person.findByIdAndUpdate(id, updatePerson, {
        new: true
    }).then(result => {
        res.json(result)
    }).catch(err => {
        next(err)
    })
})

module.exports = personsRouter
