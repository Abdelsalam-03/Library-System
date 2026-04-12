let books = [];

async function loadBooks(){
    const response = await fetch("/data/books.json");
    books = await response.json();
}


const detailsContainer = document.querySelector(".book-details");

const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");


await loadBooks();

const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
const isBorrowed = borrowedBooks.includes(+bookId);

const currentBook = books.find(book => book.id == bookId);

detailsContainer.innerHTML = `
    <img
          class="book-cover"
          src="https://covers.openlibrary.org/b/isbn/${currentBook.ISBN}-L.jpg"
          alt="clean-code-in-javascript"
        />

        <div class="details">
          <p>
            <span> Author: </span>
            ${currentBook.author}
          </p>

          <p>
            <span> Category: </span>
            ${currentBook.genre}
          </p>

          <p>
            <span> Status: </span>
            ${currentBook.available ? "Available" : "Unavailable"}
          </p>

          <p style="width: 400px">
            <span> Description: </span>
            ${currentBook.description}
          </p>

          <p>
            <span> Available Copies: </span>
            ${currentBook.available}
          </p>

          <p>
            <span> Publication Year: </span>
            ${currentBook.year}
          </p>

          <button onclick="handleBorrow(${currentBook.id})" ${isBorrowed ? "disabled" : ""} style="background-color: ${isBorrowed ? "gray" : ""}; cursor: ${isBorrowed ? "not-allowed" : "pointer"};">${isBorrowed ? "Already Borrowed" : "Borrow"}</button>
        </div>
`