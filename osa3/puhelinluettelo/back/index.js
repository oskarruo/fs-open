const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.json())

app.use(express.static('dist'))

morgan.token('data', (request) => JSON.stringify(request.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
  })

app.get('/info', (request, response) => {
    const len = persons.length
    const date = new Date().toLocaleString('en-UK', { hour12: false })
    response.send(`<p>Phonebook has info for ${len} people</p>
    <p>${date}</p>`)
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
    const person = persons.find(person => person.id === id)
    if (person) {
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
  })

app.post('/api/persons', (request, response) => {
    if (!request.body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
      }
    if (!request.body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }
    if (persons.find(person => person.name === request.body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const person = {
        "name" : request.body.name,
        "number" : request.body.number,
        "id" : Math.floor(Math.random() * 100000000) + 1
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})