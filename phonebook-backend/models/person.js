/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Please input a longer name'],
    unique: true,
    required: true
  },
  number: {
    type: String,
    required: true,
    minLength: [8, 'Please input at least 8 digits'],
    maxLength: [12, 'Please input 12 digits or fewer'],
    validate: {
      validator: (v) => {
        return /[0-9\-]{8,12}$/.test(v);
      },
      message: 'Please use only numbers or dashes'
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);