const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method);
//   console.log('Path:  ', request.path);
//   console.log('Body:  ', request.body);
//   console.log('---');
//   next();
// };
app.use(cors());
app.use(express.json());
// app.use(requestLogger);
morgan.token('req-body', function (req, res) {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :req-body'
  )
);

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
];

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Express.js API</h1>');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}<p>`);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);

  persons = persons.filter((p) => p.id !== person.id);
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'missing payload',
    });
  }

  const isDuplicate = persons.find((p) => p.name === body.name);
  if (isDuplicate) {
    return res.status(409).json({
      error: 'name is not unique',
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: String(getRandomId(1000)),
  };

  persons = persons.concat(person);
  res.status(201).json(person);
});

getRandomId = (max) => {
  let id = Math.floor(Math.random() * max);
  let person = persons.find((p) => p.id === id);
  console.log(`Generated Id: ${id}`);

  while (person) {
    id = Math.floor(Math.random() * max);
    person = persons.find((p) => p.id === id);
    console.log(`Generated Id: ${id}`);
  }

  return id;
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
