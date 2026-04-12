import { showToast } from "/utils/toast.js";
import { getBook } from "/services/admin/books.js";

const params = new URLSearchParams(window.location.search);

const ID = params.get("book");

let originalBook = {};

await fetchBook();

async function fetchBook() {
  try {
    let response = await getBook(ID);
    fillForm(response.data);
  } catch (error) {
    console.log("Not found");
    window.location.assign("/pages/admin/view_books.html");
    showToast("Book Not Found.", "error");
  }
}


function fillForm(book) {
  const form = document.getElementById("bookForm");

  form.title.value = book.title;
  form.author.value = book.author;
  form.genre.value = book.genre;
  form.isbn.value = book.ISBN;
  form.year.value = book.year;
  form.price.value = book.price;
  form.copies.value = book.copies;
  form.description.value = book.description;

  // Show image preview
  const preview = document.getElementById("preview");
  if (book.ISBN) {
    preview.src = `https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg`;
    preview.style.display = "block";
  }
}

function isChanged(oldValue, newValue) {
  return String(oldValue) !== String(newValue);
}

function validateField(name, value) {
  switch (name) {
    case "title":
    case "author":
      return value.length >= 3;

    case "genre":
      return value !== "";

    case "isbn":
      return /^[0-9\-]{10,17}$/.test(value);

    case "year":
      return value >= 1000 && value <= new Date().getFullYear();

    case "price":
      return value > 0;

    case "copies":
      return value >= 1;

    case "description":
      return value.length >= 10;

    default:
      return true;
  }
}

document.getElementById("bookForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;

  const updatedBook = {
    title: form.title.value.trim(),
    author: form.author.value.trim(),
    genre: form.genre.value,
    isbn: form.isbn.value.trim(),
    year: form.year.value,
    price: form.price.value,
    copies: form.copies.value,
    description: form.description.value.trim(),
    image: form.image.files[0]
  };

  let hasChanges = false;
  let isValid = true;

  for (let key in updatedBook) {
    if (key === "image") {
      if (updatedBook.image) {
        hasChanges = true;
      }
      continue;
    }

    if (isChanged(originalBook[key], updatedBook[key])) {
      hasChanges = true;

      if (!validateField(key, updatedBook[key])) {
        isValid = false;
      }
    }
  }

  if (isValid) {
    showToast("Book Updated Successfully.", "success");
  }


});