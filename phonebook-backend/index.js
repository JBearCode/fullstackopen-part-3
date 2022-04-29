const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('bodyContent', function (req, res) { return JSON.stringify(req.body) })

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyContent'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

  app.get('/', (request, response) => {
    response.send('<h1>Hello there!</h1>')
  })

  app.get('/info', (request, response) => {
    const infoDiv = 
        `<div><p>The API currently contains ${persons.length} contacts</p>
        <p>Timestamp: ${new Date()}</p>`
    response.send(infoDiv)
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
  })

  const generateId = () => {
    return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Must include name and number in object' 
      })
    }

    const allPriorNames = persons.map(p => p.name)
    if (allPriorNames.includes(body.name)) {
        return response.status(400).json({
          error: 'This name is already in contacts'
        })
    }

  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
      date: new Date()
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })