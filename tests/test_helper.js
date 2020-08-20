const Person = require('../models/person')

const testPersons = [
    {
        'name': 'zzzzz',
        'number': 1313333232333,
        'id': '5f1de0d763f5bad8c099f268'
    },
    {
        'name': 'eee',
        'number': 77777777,
        'id': '5f1de0ea57a822d8ddc2898e'
    }
]

const nonExistingId = async () => {
    const person = new Person({
        name: 'abc',
        number: 1232312320090
    })
    await person.save()
    await person.remove()

    return person._id.toString()
}

const personsInDb = async () => {
    const persons = await Person.find({})
    return persons.map(e => {
        return e.toJSON()
    })
}

module.exports = {
    testPersons,
    nonExistingId,
    personsInDb
}
