import { showToast } from "/utils/toast.js";

document.getElementById("bookForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let isValid = true;

  // Clear previous errors
  document.querySelectorAll(".error").forEach(el => el.textContent = "");

  const form = e.target;

  const title = form.title.value.trim();
  const author = form.author.value.trim();
  const genre = form.genre.value;
  const isbn = form.isbn.value.trim();
  const year = form.year.value;
  const price = form.price.value;
  const copies = form.copies.value;
  const image = form.image.files[0];
  const description = form.description.value.trim();

  // Title
  if (title.length < 3) {
    // document.getElementById("titleError").textContent = "Title must be at least 3 characters.";
    isValid = false;
  }

  // Author
  if (author.length < 3) {
    // document.getElementById("authorError").textContent = "Author name is too short.";
    isValid = false;
  }

  // Genre
  if (!genre) {
    // document.getElementById("genreError").textContent = "Please select a genre.";
    isValid = false;
  }

  // ISBN (basic check)
  if (!/^[0-9\-]{10,17}$/.test(isbn)) {
    // document.getElementById("isbnError").textContent = "Invalid ISBN format.";
    isValid = false;
  }

  // Year
  if (year < 1000 || year > new Date().getFullYear()) {
    // document.getElementById("yearError").textContent = "Enter a valid year.";
    isValid = false;
  }

  // Price
  if (price <= 0) {
    // document.getElementById("priceError").textContent = "Price must be greater than 0.";
    isValid = false;
  }

  // Copies
  if (copies < 1) {
    // document.getElementById("copiesError").textContent = "At least 1 copy required.";
    isValid = false;
  }

  // Image
  if (!image) {
    // document.getElementById("imageError").textContent = "Please upload a book image.";
    isValid = false;
  }

  // Description
  if (description.length < 10) {
    // document.getElementById("descriptionError").textContent = "Description too short.";
    isValid = false;
  }

  if (isValid) {
    showToast("Book Created Successfully.", "success");
    form.reset();
  }
});