const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
    .catch(error => {
      console.log('error getting books', error);
      res.sendStatus(500);
    });
});

router.post('/edit', (req, res) => {
  let id = req.body.data;
  let queryText = `SELECT * FROM "books" WHERE "id" = ${id};`;
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
    .catch(error => {
      console.log('error getting books', error);
      res.sendStatus(500);
    });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/', (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

//new PUT, for edit mode
router.put('/change/:id', (req, res) => {
  console.log('in edit server');
  const id = req.params.id;
  console.log(id)
  const edit = req.body
  //now edit is an object with new {author:..., title:...}
  const queryText = `
    UPDATE "books"
    SET "author" = $1, "title" = $2
    WHERE "id" = $3;
  `
  pool.query(queryText, [edit.author, edit.title, id])
    .then((result) => {
      console.log(result);
      //result is meaningless, only care about yay! or NO!
      //DELETES GET 200 (ok) or 204 (no content)
      res.sendStatus(200);
    }).catch((error) => {
      //even when things go wrong, send a response to client
      console.log(error);
      res.sendStatus(500);
    });
})

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put('/:id', (req, res) => {
  console.log('am i even here?')
  const id = req.params.id;
  const read = req.body.read;
  console.log(read)
  let queryText = `
    UPDATE "books"
    SET "status" = '${read}'
    WHERE "id" = $1;
  `;
  pool.query(queryText, [id])
    .then(function (response) {
      console.log(response);
      res.sendStatus(200);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    })
})

// TODO - DELETE
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
//so this is going to /books/whatevertheIDis... then its going to the database
//with that ID and deleting the specific element from the database
router.delete('/:id', (req, res) => {
  let id = req.params.id; // id of the thing to delete
  console.log('Delete route called with id of', id);
  const queryText = `DELETE FROM "books" WHERE "id" = $1;`
  // TODO - REPLACE BELOW WITH YOUR CODE
  pool.query(queryText, [id])
    .then((response) => {
      console.log(response);
      res.sendStatus(204)
    }).catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

module.exports = router;
