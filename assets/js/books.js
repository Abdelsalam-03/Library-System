import { customFetch, parseErrors } from "/utils/api.js";
import { borrowBook } from "/services/borrow.js"

let books = [];

// =========================
// BORROWED BOOKS (LOCAL STORAGE)
// =========================
let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

// =========================
// LOAD FROM BACKEND
// =========================
async function loadBooks(params = {}) {
  try {
    let url = `/api/books/?`;
    if (params.status) {
      if (params.status == "available") params.available = 1;
      else params.available = 0;
      delete params.status;
    } else {
      delete params.available;
    }
    const querystring = new URLSearchParams(params).toString();
    const response = await customFetch(url + querystring, {
      method: "GET",
    });
    let { data } = await response.json();
    if (data) {
      books = data;
      displayBooks(data);
    }
    // return { data: data };
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

// =========================
// DISPLAY BOOKS
// =========================
function displayBooks(bookList) {
  let table = document.getElementById("booksTable");
  table.innerHTML = "";

  bookList.forEach((book) => {
    const isBorrowed = borrowedBooks.includes(Number(book.id));

    table.innerHTML += `
      <tr>
        <td>${book.title}</td>
        <td class="image">
          <img src="https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg" 
          alt="${book.title} cover">
        </td>
        <td>${book.author}</td>
        <td>${book.genre.name}</td>
        <td>${book.available > 0 ? "Available" : "Unavailable"}</td>
        <td>
          <a href="view_book.html?id=${book.id}">View</a>

          <button class="borrow" data-id="${book.id}"
            ${isBorrowed ? "disabled" : ""}
            style="background-color: ${isBorrowed ? "gray" : ""};
                   cursor: ${isBorrowed ? "not-allowed" : "pointer"};">
            ${isBorrowed ? "Already Borrowed" : "Borrow"}
          </button>
        </td>
      </tr>
    `;
  });
}



// =========================
// FILTER BOOKS
// =========================
function filterBooks() {
  let search = document.getElementById("searchInput").value.toLowerCase();
  let category = document.getElementById("categoryFilter").value;

  let filtered = books.filter((book) => {
    let matchesSearch =
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search);

    let matchesCategory = category === "All" || book.genre === category;

    return matchesSearch && matchesCategory;
  });

  displayBooks(filtered);
}

// =========================
// BORROW BOOK
// =========================
function handleBorrow(bookId) {
  if (!borrowedBooks.includes(bookId)) {
    borrowedBooks.push(bookId);

    localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

    displayBooks(books);
  }
}

// =========================
// INIT
// =========================
window.onload = async function () {
  await loadBooks();
};

async function borrow(id) {
  try {
    let response = await borrowBook(id)
    console.log(response);
  } catch (error) {
    
  }
}

const table = document.getElementById("books_table");

table.addEventListener("click", (e) => {
    if (e.target.classList.contains("borrow")) {
        borrow(e.target.dataset.id)
    }
});