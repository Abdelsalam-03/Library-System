const ratingsStorageKey = "returnedBookRatings";

const ratingModal = document.getElementById("ratingModal");
const ratingBookName = document.getElementById("ratingBookName");
const ratingComment = document.getElementById("ratingComment");
const submitRatingBtn = document.getElementById("submitRating");
const cancelRatingBtn = document.getElementById("cancelRating");
const closeRatingModalBtn = document.getElementById("closeRatingModal");
const starButtons = document.querySelectorAll(".star-btn");

let selectedRating = 0;
let activeRow = null;

function returnBook(button) {
  activeRow = button.closest("tr");
  const bookTitle = activeRow.cells[0].innerText;

  ratingBookName.innerText = bookTitle;
  ratingComment.value = "";
  setSelectedRating(0);
  ratingModal.classList.remove("hidden");
}

function renewBook(button) {
  const row = button.parentElement.parentElement;
  const dueDateCell = row.cells[3];

  const date = new Date(dueDateCell.innerText);
  date.setDate(date.getDate() + 7);

  dueDateCell.innerText = date.toISOString().split("T")[0];

  row.style.backgroundColor = "#3A7D44";
  row.style.color = "white";

  setTimeout(() => {
    row.style.backgroundColor = "";
    row.style.color = "";
  }, 500);
}

function viewBook(title) {
  alert("Book Details:\n\n" + title);
}

function reborrowBook(title) {
  alert("You have reborrowed:\n\n" + title);
}

function highlightOverdue() {
  const rows = document.querySelectorAll("table tr");
  const today = new Date();

  rows.forEach((row, index) => {
    if (index === 0 || row.cells.length < 4) return;

    const dueDate = new Date(row.cells[3].innerText);

    if (dueDate < today) {
      row.style.backgroundColor = "#fff1f1";
    }
  });
}

function setSelectedRating(value) {
  selectedRating = value;

  starButtons.forEach((button) => {
    const buttonValue = Number(button.dataset.value);
    button.classList.toggle("active", buttonValue <= value);
  });
}

function closeRatingModal() {
  ratingModal.classList.add("hidden");
  activeRow = null;
  ratingComment.value = "";
  setSelectedRating(0);
}

function getStoredRatings() {
  try {
    return JSON.parse(localStorage.getItem(ratingsStorageKey)) || [];
  } catch (error) {
    return [];
  }
}

function saveRatings(ratings) {
  localStorage.setItem(ratingsStorageKey, JSON.stringify(ratings));
}

function submitRating() {
  if (!activeRow) return;

  if (!selectedRating) {
    alert("Please choose a rating before returning the book.");
    return;
  }

  const title = activeRow.cells[0].innerText;
  const comment = ratingComment.value.trim();
  const returnedAt = new Date().toISOString().split("T")[0];

  const ratings = getStoredRatings();
  ratings.unshift({
    title,
    score: selectedRating,
    comment,
    returnedAt,
  });

  saveRatings(ratings.slice(0, 12));

  activeRow.style.backgroundColor = "#8B1E3F";
  activeRow.style.color = "white";

  setTimeout(() => {
    activeRow.remove();
    closeRatingModal();
  }, 300);
}

starButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setSelectedRating(Number(button.dataset.value));
  });
});

submitRatingBtn.addEventListener("click", submitRating);
cancelRatingBtn.addEventListener("click", closeRatingModal);
closeRatingModalBtn.addEventListener("click", closeRatingModal);

ratingModal.addEventListener("click", (event) => {
  if (event.target === ratingModal) {
    closeRatingModal();
  }
});


function handleBorrow(bookId){
  const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];


  if(borrowedBooks.includes(bookId)){
    alert("You have already borrowed this book!");
    return;
  }
  const confirmation = confirm("Are you sure borrowing this book?");
  
  if(confirmation){
    borrowedBooks.push(bookId);
    localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
    window.location.reload();
  }
} 

window.onload = () => {
  highlightOverdue();
};

