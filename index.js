const express = require('express')

const morgan = require('morgan')

const app = express()

app.use(express.json())

morgan.token('body', function(req, res){
        const { body } = req
        return body ? JSON.stringify(body) : 'noBody'
    })

morgan.format('hb', '[hb] :method :url :status :res[content-length] - :response-time ms :body');

app.use(morgan('hb'))

let persons = [
    {
      id: 1,
      name: "aaa",
      number: "111"
    },
    {
      id: 2,
      name: "bbb",
      number: "222"
    },
    {
      id: 3,
      name: "ccc",
      number: "333"
    },
    {
      id: 4,
      name: "ddd",
      number: "444"
    }
  ]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    res.send(`
            <h5>Phonebook has info for ${ persons.length } people</h5>
            <p>${ new Date().toISOString() }</p>
        `)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const { id } = req.params
    const person = persons.find(person => person.id === Number(id))
    if (!person) {
        res.status(400).send('@error, can\'t find this people')
    }
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const { id } = req.params
    const hasPeople = persons.findIndex(person => {
            return person.id === Number(id)
        }) !== -1
    if (!hasPeople) {
        return res.status(404).send('has not this people')
    }

    persons = persons.filter(person => person.id !== Number(id))

    res.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body

    if (!name || !number) {
        return res.status(400).json({
                error: 'name and number are required'
            })
    }

    const hasSameName = persons.findIndex(person => {
            return person.name === name
        }) !== -1

    if (hasSameName) {
        return res.status(400).json({
                error: 'name must be unique'
            })
    }

    const newPerson = {
        id: generateId(),
        name,
        number
    }

    persons = persons.concat(newPerson)

    res.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
