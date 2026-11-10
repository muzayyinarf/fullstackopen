const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

morgan.token("body", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

//Exercise 3.1: Implement the GET /api/persons endpoint to return all persons in the phonebook
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

//Exercise 3.2: Implement the GET /info endpoint to return the number of people in the phonebook and the current date and time
app.get("/info", (request, response) => {
  const count = persons.length;
  const currentTime = new Date();

  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${currentTime}</p>
  `);
});

//Exercise 3.3: Implement the GET /api/persons/:id endpoint to return a specific person by ID
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

//Exercise 3.4: Implement the DELETE /api/persons/:id endpoint to delete a specific person by ID
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});
// Helper for Random ID (Exercise 3.5)
const generateId = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

//Exercise 3.5: Implement the POST /api/persons endpoint to add a new person to the phonebook
app.post("/api/persons", (request, response) => {
  const body = request.body;

  // Validasi: nama atau nomor wajib diisi
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number is missing" });
  }

  // Validasi: nama harus unik
  const existingPerson = persons.find((p) => p.name === body.name);
  if (existingPerson) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
