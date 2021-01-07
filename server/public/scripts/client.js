$(document).ready(function () {
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $(document).on('click', '.deleteButton', deleteBook)
  $(document).on('click', '.readButton', markAsRead)
  $(document).on('click', '.editButton', beginEdit)
  $(document).on('click', '#submitEdit', submitEdit)
  $(document).on('click', '#cancelEdit', cancelEdit)
  // TODO - Add code for edit & delete buttons
}
//this function should toggle edit mode on and off.
//DOM should indicate that the inputs are now in edit mode
//Create new submit button in place of old submit button?
//New submit button should send changes to database and then update DOM
let editMode = false;
function beginEdit() {
  console.log('in edit')
  //edit mode becomes TRUE, and we send the unique ID into the EDIT mode
  //we'll use the unique ID to target the specific inputs. We should do
  //a GET request to populate the inputs with data from the database
  editMode = true;
  let id = $(this).data('id');
  if (editMode === true) {
    renderDomInEdit(id);
  }
}

function renderDomInEdit(uniqueID) {
  //now we're in edit mode, we should do a get request and store
  //the data from the database in the input fields
  //AND
  //change the header to say EDIT MODE?
  //then, when the submit button is clicked again,
  //we send the data to the dom with a PUT request
  //and update the ENTIRE entry
  let id = { data: uniqueID };
  console.log('in DOM reRender')
  console.log(id)
  $.ajax({
    type: 'POST',
    url: '/books/edit',
    data: id
  }).then(function (response) {
    console.log(response);
    editInputValues(response);
  })
  //after submit button clicked, DOM should reset, reassign editMode to false;
}
//takes info from database and populates, adds data to submit button
//to send back edited data to server as PUT request
function editInputValues(data) {
  $('#title').val(`${data[0].title}`);
  $('#author').val(`${data[0].author}`);
  $("#editTarget").append(`
    <button type="button" id="submitEdit" data-id="${data[0].id}">Submit Edit</button>
    <button type="button" id="cancelEdit">Cancel Edit</button>`
  )
}
function submitEdit() {
  console.log('pre edit submit')
  const id = $(this).data('id');
  console.log(id)
  const sendData = {
    author: $('#author').val(),
    title: $('#title').val()
  }
  $.ajax({
    type: 'PUT',
    url: `/books/change/${id}`,
    data: sendData
  }).then(function (response) {
    console.log(response);
    refreshBooks();
    cancelEdit();
  }).catch(function (error) {
    alert('error editing!')
    console.log(error);
  })
}
//cancell edit refreshes the DOM and deletes the buttons from EDIT mode
function cancelEdit() {
  $('#editTarget').empty();
  refreshBooks();
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

    // For each book, append a new row to our table
    let $tr = $('<tr></tr>');
    $tr.data('book', book);
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<td>${book.status}</td>`);
    $tr.append(`<td class="readButton" data-id="${books[i].id}"><button>Mark as Read</button>`)
    $tr.append(`<td><button class="editButton" data-id="${books[i].id}">EDIT</button>`)
    $tr.append(`<td><button class="deleteButton" data-id="${books[i].id}">DELETE</button>`)
    $('#bookShelf').append($tr);
  }
  $('input').val('');
}
