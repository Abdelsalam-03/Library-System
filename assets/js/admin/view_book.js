import { getBook } from "/services/admin/books.js";
import { customFetch } from "/utils/api.js";

const params = new URLSearchParams(window.location.search);

const ID = params.get("id");

await fetchBook();

async function fetchBook() {
  try {
    let response = await getBook(ID);
    fillBookInformation(response);
  } catch (error) {
    console.log(error);
  }
}

function fillBookInformation(book) {
  let container = document.getElementById("information");

  container.innerHTML = `
    <div class="book_header">
            <img src="https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg" alt="Book Cover" class="book_cover">

            <div class="book_info">
                <h1>${book.title}</h1>
                <p class="author">by ${book.author}</p>
                <p class="isbn">isbn: ${book.isbn}</p>

                <div class="actions">
                    <a href="/pages/admin/edit_book.html?book=${book.id}" class="edit-btn">Edit</a>
                    <button class="delete-btn" onclick="deleteBook(${book.id})">Delete</button>
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

async function deleteBook(id) {
  let confirm = window.confirm("Are you sure you want to delete?")
  if (confirm) {
    try {
      let response = await customFetch(`/api/admin/books/${id}/`, {
        method: "DELETE",
      });
  
      alert("Book deleted successfully, click ok to refresh");
      window.location.assign("/pages/admin/view_books.html");
    } catch (error) {
      alert("Error deleting book, click ok to try again");
    }
  }
}

window.deleteBook = deleteBook;
