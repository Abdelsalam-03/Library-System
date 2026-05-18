import { addBook, getGenres } from "/services/admin/books.js";
import { showToast } from "/utils/toast.js";

document
  .getElementById("bookForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    let isValid = true;

    // Clear previous errors
    document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));

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

    console.log(genre);
    if (isValid) {
      try {
        const newBook = {
          title: title,
          author: author,
          genre: genre,
          isbn: isbn,
          year: year,
          copies: copies,
          available: copies,
          price: price,
        };

        let response = await addBook(newBook);
        console.log(response);
        if (response) {
          showToast("Book Created Successfully.", "success");
          form.reset();
        } else {
          showToast("Failed to create book.", "error");
        }
      } catch (err) {
        console.error(err);
        showToast("Something went wrong: " + err.message, "error");
      }
    }
  });

async function fetchGenres() {
  try {
    let response = await getGenres();
    fillGenresSelect(response);
  } catch (error) {
    console.log(error);
  }
}

await fetchGenres();

function fillGenresSelect(genres) {
  let selectElement = document.getElementById("genre");
  const fragment = document.createDocumentFragment();

  genres.forEach((genre) => {
    const option = document.createElement("option");

    option.value = genre.id;
    option.textContent = genre.name;

    fragment.appendChild(option);
  });

  selectElement.innerHTML = "";
  selectElement.appendChild(fragment);
}
