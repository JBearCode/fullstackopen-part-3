const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: [3, 'Please input a longer name'],
      required: true
    },
    number: {
      type: String,
      required: true,
      minLength: [5, 'Please input at least 5 digits'],
      maxLength: [10, 'Please use 10 digits or fewer']
    },
    date: {
      type: Date,
      default: Date.now
    }
  });

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)