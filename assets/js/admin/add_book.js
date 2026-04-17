import { showToast } from "/utils/toast.js";

document.getElementById("bookForm").addEventListener("submit", async function(e) {
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
    isValid = false;
  }

  // Author
  if (author.length < 3) {
    isValid = false;
  }

  // Genre
  if (!genre) {
    isValid = false;
  }

  // ISBN (basic check)
  if (!/^[0-9\-]{10,17}$/.test(isbn)) {
    isValid = false;
  }

  // Year
  if (year < 1000 || year > new Date().getFullYear()) {
    isValid = false;
  }

  // Price
  if (price <= 0) {
    isValid = false;
  }

  // Copies
  if (copies < 1) {
    isValid = false;
  }

  // Image
  if (!image) {
    isValid = false;
  }

  // Description
  if (description.length < 10) {
    isValid = false;
  }

  if (isValid) {
      try {
      const books = JSON.parse(localStorage.getItem("books") || "[]");

      const nextId = books.length > 0
        ? Math.max(...books.map(b => b.id)) + 1
        : 1;

      const newBook = {
        id:          nextId,
        title:       title,
        author:      author,
        genre:       genre,
        ISBN:        isbn,
        year:        year,
        copies:      copies,
        available:   copies,
        price:       price,
        description: description,
      };

      books.push(newBook);
      localStorage.setItem("books", JSON.stringify(books));


      showToast("Book Created Successfully.", "success");
      form.reset();

    } catch (err) {
      console.error(err);
      showToast("Something went wrong: " + err.message, "error");
    }
    
  }
});