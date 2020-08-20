const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Person = require('../models/person')

beforeEach(async () => {
    await Person.deleteMany({})

    const personObjects = helper.testPersons.map(e => {
        return new Person(e)
    })
    const promiseArray = personObjects.map(e => e.save())
    await Promise.all(promiseArray)
})

test('persons are returned as json', async () => {
    await api
        .get('/api/persons')
        .expect(200)
        .expect('content-type', /application\/json/)
})

test('there are two persons', async () => {
    const res = await api.get('/api/persons')

    expect(res.body).toHaveLength(helper.testPersons.length)
})

test('the first person is about HTTP methods', async () => {
    const res = await api.get('/api/persons')
    const names = res.body.map(r => r.name)

    expect(names).toContain(
        'eee'
    )
})

test('a valid person can be added', async () => {
    const newPerson = {
        'name': 'abc',
        'number': 11113213
    }

    await api
        .post('/api/persons')
        .send(newPerson)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const personsAtEnd = await helper.personsInDb()

    const names = personsAtEnd.map(r => r.name)

    expect(personsAtEnd).toHaveLength(helper.testPersons.length + 1)
    expect(names).toContain(
        'abc'
    )
})

test('person without name can not be added', async () => {
    const newPerson = {
        'number': 11113213
    }

    await api
        .post('/api/persons')
        .send(newPerson)
        .expect(400)

    const personsAtEnd = await helper.personsInDb()

    expect(personsAtEnd).toHaveLength(helper.testPersons.length)
})

test('a person can be viewed', async () => {
    const personAtStart = await helper.personsInDb()
    const personToView = personAtStart[0]

    const resultPerson = await api
        .get(`/api/persons/${ personToView.id }`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(resultPerson.body).toEqual(personToView)
})

test('a person can be deleted', async () => {
    const personAtStart = await helper.personsInDb()
    const personToDelete = personAtStart[0]

    await api
        .delete(`/api/persons/${ personToDelete.id }`)
        .expect(204)

    const personsAtEnd = await helper.personsInDb()

    expect(personsAtEnd).toHaveLength(
        helper.testPersons.length - 1
    )

    const names = personsAtEnd.map(e => e.name)

    expect(names).not.toContain(personToDelete.name)
})

afterAll(() => {
    mongoose.connection.close()
})
