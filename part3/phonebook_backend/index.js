const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

// Exercise 3.11: Menyajikan frontend statis dari folder dist
app.use(express.static('dist'))

// Exercise 3.9: Middleware CORS agar frontend React bisa request ke backend
app.use(cors())

// Middleware parsing JSON body
app.use(express.json())

// Exercise 3.8: Custom token morgan untuk mencatat body saat request POST
morgan.token('body', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : ''
})

// Exercise 3.7 & 3.8: Middleware morgan format tiny + :body
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// Data awal Phonebook (Exercise 3.1)
let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

// Exercise 3.1: GET semua data kontak
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Exercise 3.2: GET halaman info
app.get('/info', (request, response) => {
  const count = persons.length
  const currentTime = new Date()

  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${currentTime}</p>
  `)
})

// Exercise 3.3: GET satu kontak berdasarkan ID
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((p) => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Exercise 3.4: DELETE kontak berdasarkan ID
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((p) => p.id !== id)
  response.status(204).end()
})

// Helper untuk membuat ID acak (Exercise 3.5)
const generateId = () => {
  return Math.floor(Math.random() * 1000000).toString()
}

// Exercise 3.5 & 3.6: POST kontak baru dengan validasi
app.post('/api/persons', (request, response) => {
  const body = request.body

  // Validasi: nama atau nomor wajib diisi
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  // Validasi: nama harus unik
  const existingPerson = persons.find((p) => p.name.toLowerCase() === body.name.toLowerCase())
  if (existingPerson) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

// Exercise 3.10: Port dinamis untuk deployment (misal di Render/Fly.io) atau lokal 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
