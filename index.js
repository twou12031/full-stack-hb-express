require('dotenv').config()
const express = require('express')
// const morgan = require('morgan')
// const cors = require('cors')

// schema
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))

// app.use(cors)

app.use(express.json())


// morgan.token('body', function(req, res){
//         const { body } = req
//         return body ? JSON.stringify(body) : 'noBody'
//     })

// morgan.format('hb', '[hb] :method :url :status :res[content-length] - :response-time ms :body');

// app.use(morgan('hb'))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    Person.find({}).then(dbRes => {
        res.send(`
                <h5>Phonebook has info for ${ dbRes.length } people</h5>
                <p>${ new Date().toISOString() }</p>
            `)
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(dbRes => {
        res.send(dbRes)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const { id } = req.params

    Person.findOne({ _id: id }).then(dbRes => {
        if (!dbRes) {
            res.status(400).send('@err, can\'t find this people')
            return
        }
        res.json(dbRes)
    }).catch(err => {
        next(err)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
    const { id } = req.params

    Person.findByIdAndRemove(id).then(dbRes => {
        console.log(dbRes)
        res.status(204).send()
    }).catch(err => {
        next(err)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const { id } = req.params
    const { name, number } = req.body

    const person = {
        name,
        number
    }

    Person.findByIdAndUpdate(id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        }).catch(err => next(err))
})

// const generateId = () => {
//     const maxId = persons.length > 0
//         ? Math.max(...persons.map(n => n.id))
//         : 0
//     return maxId + 1
// }

app.post('/api/persons', (req, res, next) => {
    const { name, number } = req.body

    // if (!name || !number) {
    //     return res.status(400).json({
    //             err: 'name and number are required'
    //         })
    // }

    // const hasSameName = person.find(person => {
    //         return person.name === name
    //     }) !== -1

    // if (hasSameName) {
    //     return res.status(400).json({
    //             err: 'name must be unique'
    //         })
    // }

    const person = new Person({
        name,
        number
    })

    person.save().then(dbRes => {
        console.log(dbRes)
        res.json(dbRes)
    }).catch(err => {
        next(err)
    })

    // Person.findOne({name}).then(dbRes => {
    //     if (dbRes) {
    //         const { _id } = dbRes
    //         Person.findByIdAndUpdate(_id.toString(), {
    //             name,
    //             number
    //         }, { new: true })
    //             .then(updatedPerson => {
    //                 res.json(updatedPerson)
    //             }).catch(err => {
    //                 next(err)
    //             })
    //         return
    //     }
    // }).catch(err => {
    //     next(err)
    // })
})

const unknownEndpoint = (req, res) => {
    console.log('@@@@@@@')
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errHandler = (err, req, res, next) => {
    console.log(err.message)

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).send({
            err: 'illegal id'
        })
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            err: err.message
        })
    }

    next()
}

app.use(errHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
