import { getBook } from "/services/admin/books.js";

const params = new URLSearchParams(window.location.search);

const ID = params.get("id");


await fetchBook();

async function fetchBook() {
  try {
    let response = await getBook(ID);
    fillBookInformation(response.data);
  } catch (error) {
    console.log(error);
  }
}

function fillBookInformation(book) {
  let container = document.getElementById("information");

  container.innerHTML = `
    <div class="book_header">
            <img src="https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg" alt="Book Cover" class="book_cover">

            <div class="book_info">
                <h1>${book.title}</h1>
                <p class="author">by ${book.author}</p>
                <p class="isbn">ISBN: ${book.ISBN}</p>

                <div class="actions">
                    <a href="/pages/admin/edit_book.html?book=${book.id}" class="edit-btn">Edit</a>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
        </div>

        <div class="book_details">
            <div class="detail"><span>Genre</span><strong>${book.genre}</strong></div>
            <div class="detail"><span>Year</span><strong>${book.year}</strong></div>
            <div class="detail"><span>Total Copies</span><strong>${book.copies}</strong></div>
            <div class="detail"><span>Available</span><strong>${book.available}</strong></div>
            <div class="detail"><span>Price</span><strong>$${book.price}</strong></div>
        </div>
        ${
          book.description != undefined
            ? `<div class="book_details">
            <div class="detail"><span>Description</span>
              ${book.description}
            </div>
        </div>`
            : ``
        }
        
  `;
}
