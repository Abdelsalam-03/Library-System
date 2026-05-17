import { getGenres } from "/services/admin/books.js";
import { getBooksStats } from "/services/admin/books.js";
import { getBooks } from "/services/admin/books.js";
import { customFetch } from "/utils/api.js";


fetchBooks({});
fetchBooksStats();
fetchGenres();

let filters = {};

const searchField = document.getElementById("search");
const genreField = document.getElementById("genre");
const statusField = document.getElementById("status");

const booksTableBody = document.querySelector("#books_table tbody");
booksTableBody.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  if (!row) return;

  if (e.target.closest("button, a")) return;

  const id = row.dataset.id;
  window.location.assign(`./view_book.html?id=${id}`);
});

// searchField.addEventListener("change", handleSearch);
searchField.addEventListener("input", debounce(handleSearch, 300));
genreField.addEventListener("change", () =>
  updateFilters({ genre: genreField.value }),
);
statusField.addEventListener("change", () =>
  updateFilters({ status: statusField.value }),
);

function updateFilters(newValue) {
  filters = { ...filters, ...newValue };
  fetchBooks(filters);
}

function handleSearch() {
  let query = searchField.value.trim();
  if (query.length > 0) {
    filters = { ...filters, query: query };
    fetchBooks(filters);
  } else {
    fetchBooks();
  }
}

async function fetchBooks(params = {}) {
  try {
    let {data} = await getBooks(params);
    let genres = await getGenres();

    fillBooksTable(data, genres);
  } catch (error) {
    console.log(error);
  }
}

async function fetchBooksStats() {
  try {
    let stats = await getBooksStats();
    fillBooksStats(stats);
  } catch (error) {
    console.log(error);
  }
}

async function fetchGenres() {
  try {
    let response = await getGenres();
    fillGenresOptions(response);
  } catch (error) {
    console.log(error);
  }
}

function fillBooksTable(books, genres) {
  if (!books.length) {
    booksTableBody.innerHTML = `<tr><td class="empty" colspan="9">No books found</td></tr>`;
    return;
  }
  let body = document.createDocumentFragment();
  books.forEach((book) => {
    const row = document.createElement("tr");
    row.dataset.id = book.id;
    row.innerHTML = `
    <td class="image">
    <img src="https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg" 
    alt="${book.title} cover">
    </td>
    <td class="info">
        <span class="title">${book.title}</span>
        <span class="isbn">${book.isbn}</span>
    </td>
    <td>${book.author}</td>
    <td>${genres.find(g => g.id == book.genre)?.name}</td>
    <td>${book.year}</td>
    <td>${book.copies}</td>
    <td>${book.available}</td>
    <td class="price">$${book.price}</td>
    <td class="actions">
      <a href="/pages/admin/edit_book.html?book=${book.id}">Edit</a>  
      <button class="delete" onclick="deleteBook(${book.id})">Delete</button>
    </td>
  `;

    body.appendChild(row);
  });
  booksTableBody.innerHTML = "";
  booksTableBody.appendChild(body);
}

window.deleteBook = async function (id) {
  try {
    let response = await customFetch(`/api/admin/books/${id}/`, {
      method: "DELETE",
    });

    alert("Book deleted successfully, click ok to refresh");
    window.location.reload();
  } catch (error) {
    alert("Error deleting book, click ok to try again");
  }
}

function fillBooksStats(stats) {
  let totalBooksDiv = document.getElementById("total");
  totalBooksDiv.querySelector(".value").innerHTML = stats.total_books;
  let availableBooksDiv = document.getElementById("available");
  availableBooksDiv.querySelector(".value").innerHTML = stats.available_books;
  let borrowedBooksDiv = document.getElementById("borrowed");
  borrowedBooksDiv.querySelector(".value").innerHTML = stats.borrowed_books;
  let genresDiv = document.getElementById("genres");
  genresDiv.querySelector(".value").innerHTML = stats.total_genres;
}

function fillGenresOptions(genres) {
  let content = `
    <option value="">All Genres</option>
  `;
  genres.forEach((genre) => {
    content += `
    <option value="${genre.id}">${genre.name}</option>
    `;
  });
  genreField.innerHTML = content;
}

function debounce(callback, delay) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

function clearFilters() {
  console.log("Clearing");
  fetchBooks({});
  // searchField.
}
