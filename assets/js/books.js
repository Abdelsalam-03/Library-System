let books = [];

// =========================
// BORROWED BOOKS (LOCAL STORAGE)
// =========================
let borrowedBooks =
  JSON.parse(localStorage.getItem("borrowedBooks")) || [];

// =========================
// LOAD FROM BACKEND
// =========================
async function loadBooks() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/books/");
    const result = await response.json();

    // IMPORTANT: your API returns {success, data}
    books = result.data || [];

    displayBooks(books);
  } catch (error) {
    console.error("Error loading books:", error);
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
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.available ? "Available" : "Unavailable"}</td>
        <td>
          <a href="view_book.html?id=${book.id}">View</a>

          <button onclick="handleBorrow(${book.id})"
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

    let matchesCategory =
      category === "All" || book.genre === category;

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

    localStorage.setItem(
      "borrowedBooks",
      JSON.stringify(borrowedBooks)
    );

    displayBooks(books);
  }
}

// =========================
// INIT
// =========================
window.onload = async function () {
  await loadBooks();
};