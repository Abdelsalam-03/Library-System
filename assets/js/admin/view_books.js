import { getGenres } from "/services/admin/genres.js";
import { getBooksStats } from "/services/admin/books.js";
import { getBooks } from "/services/admin/books.js";

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
    let response = await getBooks(params);
    fillBooksTable(response.data);
  } catch (error) {
    console.log(error);
  }
}

async function fetchBooksStats() {
  try {
    let response = await getBooksStats();
    fillBooksStats(response.data);
  } catch (error) {
    console.log(error);
  }
}

async function fetchGenres() {
  try {
    let response = await getGenres();
    fillGenresOptions(response.data);
  } catch (error) {
    console.log(error);
  }
}

function fillBooksTable(books) {
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
    <img src="https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg" 
    alt="${book.title} cover">
    </td>
    <td class="info">
        <span class="title">${book.title}</span>
        <span class="isbn">${book.ISBN}</span>
    </td>
    <td>${book.author}</td>
    <td>${book.genre}</td>
    <td>${book.year}</td>
    <td>${book.copies}</td>
    <td>${book.available}</td>
    <td class="price">$${book.price}</td>
    <td class="actions">
      <a href="#">Edit</a>
      <button class="delete">Delete</button>
    </td>
  `;

    body.appendChild(row);
  });
  booksTableBody.innerHTML = "";
  booksTableBody.appendChild(body);
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
    <option value="all">All Genres</option>
  `;
  genres.forEach((genre) => {
    content += `
    <option value="${genre.name}">${genre.name}</option>
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
