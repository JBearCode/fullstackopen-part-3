require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');
const { modelName } = require('./models/person');

morgan.token('bodyContent', function (req, res) { return JSON.stringify(req.body); });

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyContent'));

app.get('/', (request, response) => {
  response.send('<h1>Hello there!</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person);
  });
});

app.get('/info', (request, response) => {
  Person.countDocuments({}).then(num => {
    response.send(`<p>There are ${num} contacts in the database.</p><p>Timestamp: ${new Date()}</p>`);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  
  if (body.name === undefined) {
    return response.status(400).json({ error: 'Missing name or number' });
  }
  
  const person = new Person({
    name: body.name,
    number: body.number,
  });
    
  person.save().then(savedPerson => {
    response.json(savedPerson);
  })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;
  
  Person.findByIdAndUpdate(request.params.id, 
    {name, number}, 
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});

// unknown endpoint handler, loaded before only error handler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

// error handler function, last loaded middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'issue with id format' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  
  next(error);
};
app.use(errorHandler);
  
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});