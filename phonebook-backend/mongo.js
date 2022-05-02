const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log('Please provide the password, contact name, and contact number as arguments: node mongo.js <password> <name> <number>')
    process.exit(1)
  }

const password = process.argv[2]
const contactName = process.argv[3]
const contactNumber = process.argv[4]

const url = `mongodb+srv://JoelCluster:${password}@cluster0.s8k63.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
} else {

const person = new Person({
  name: contactName,
  number: contactNumber
})

person.save().then(result => {
  console.log(`Added ${contactName} (${contactNumber}) to your contacts`)
  mongoose.connection.close()
})

}