$(document).ready(function () {
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $(document).on('click', '.deleteButton', deleteBook)
  $(document).on('click', '.readButton', markAsRead)
  // TODO - Add code for edit & delete buttons
}
//function to update status in "books", will change status to read with PUT
//then will update DOM with new information from database
function markAsRead() {
  console.log('in mark func');
  const id = $(this).data('id');
  console.log(id);
  const dataToSend = {
    read: 'Read'
  }
  $.ajax({
    type: 'PUT',
    url: `/books/${id}`,
    data: dataToSend
  }).then(function (response) {
    console.log('updated');
    refreshBooks();
  }).catch(function (error) {
    alert('error updating read')
    console.log(error)
  })
}
//function to remove book from database, append DOM with new information
function deleteBook() {
  console.log('in delete')
  const id = $(this).data('id');
  console.log(id)
  $.ajax({
    type: 'DELETE',
    url: `/books/${id}`
  }).then(function (response) {
    console.log(response)
    refreshBooks()
  }).catch(function (error) {
    console.log(error);
    alert('error deleting book');
  })
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
  }).then(function (response) {
    console.log('Response from server.', response);
    refreshBooks();
  }).catch(function (error) {
    console.log('Error in POST', error)
    alert('Unable to add book at this time. Please try again later.');
  });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function (response) {
    console.log(response);
    renderBooks(response);
  }).catch(function (error) {
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for (let i = 0; i < books.length; i += 1) {
    let book = books[i];
    let status;
    if (book.status === 'Want to Read') {
      status = "checked"
    }
    // For each book, append a new row to our table
    let $tr = $('<tr></tr>');
    $tr.data('book', book);
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<td>${book.status}</td>`);
    $tr.append(`<td class="readButton" data-id="${books[i].id}"><button>Mark as Read</button>`)
    $tr.append(`<td class="deleteButton" data-id="${books[i].id}"><button>DELETE</button>`)
    $('#bookShelf').append($tr);
  }
}
