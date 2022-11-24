const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid = require('./public/assets/js/uuid');

const PORT = 3000;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Wildcard route to direct users to return to the Homepage
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
  );

const readFromFile = util.promisify(fs.readFile);

const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST request to add a review
app.post('/api/notes', (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if ( req.body) {
    // Variable for the object we will save
    const newNotes = {
      title,
      text,
      note_id: uuid(),
    };

    // Convert the data to a string so we can save it
    readAndAppend(newNotes, './db/db.json');
    
  }
})



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
