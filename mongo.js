const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

// const password = process.argv[2]

const [fullPath, fileName, password, name, number] = process.argv

const url = `mongodb+srv://hb-mongodb:${password}@cluster0.4bxrf.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
    const person = new Person({
        name,
        number
    })

    person.save().then(result => {
        console.log('@save sucessed')
        mongoose.connection.close()
    }).catch(err => {
        console.log(err)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        console.log('@console start')
        result.forEach(person => {
            const { name, number } = person
            console.log(name, number)
        })
        console.log('@console end')
        mongoose.connection.close()
    }).catch(err => {
        console.log(err)
        mongoose.connection.close()
    })
}

