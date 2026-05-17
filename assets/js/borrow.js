import { 
  fetchMyBorrowings, 
  returnBorrowedBook, 
  renewBorrow 
} from "/services/borrow.js";

const ratingsStorageKey = "returnedBookRatings";

const ratingModal = document.getElementById("ratingModal");
const ratingBookName = document.getElementById("ratingBookName");
const ratingComment = document.getElementById("ratingComment");
const submitRatingBtn = document.getElementById("submitRating");
const cancelRatingBtn = document.getElementById("cancelRating");
const closeRatingModalBtn = document.getElementById("closeRatingModal");
const starButtons = document.querySelectorAll(".star-btn");
const borrowTable = document.querySelector("table tbody");

let selectedRating = 0;
let activeRow = null;
let activeBorrowId = null;

// Format date helper function
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

// Load borrowed books from API
async function loadBorrowedBooks() {
  const borrowings = await fetchMyBorrowings();
  
  if (!borrowTable) {
    console.error("Table body not found");
    return;
  }

  // Clear existing rows (keep header)
  const rows = borrowTable.querySelectorAll("tr");
  rows.forEach(row => row.remove());

  // Add rows for each borrowing
  borrowings.forEach(borrowing => {
    const row = document.createElement("tr");
    
    // Check if overdue
    const dueDate = new Date(borrowing.due_date);
    const today = new Date();
    if (borrowing.status === "approved" && dueDate < today) {
      row.style.backgroundColor = "#fff1f1";
    }

    const borrowedDate = formatDate(borrowing.borrowed_at || borrowing.approved_at);
    const dueFormattedDate = formatDate(borrowing.due_date);

    let actionButtons = '';
    if (borrowing.status === "approved") {
      actionButtons = `
        <button onclick="returnBook(this)" data-borrow-id="${borrowing.id}">Return</button>
        <button onclick="renewBook(this)" data-borrow-id="${borrowing.id}">Renew</button>
      `;
    } else if (borrowing.status === "returned") {
      actionButtons = `<span style="color: #666; font-size: 0.9em;">Returned</span>`;
    } else if (borrowing.status === "pending") {
      actionButtons = `<span style="color: #f39c12; font-size: 0.9em;">Pending Approval</span>`;
    }

    row.innerHTML = `
      <td>${borrowing.book_title}</td>
      <td>${borrowing.book_author}</td>
      <td>${borrowedDate}</td>
      <td>${dueFormattedDate}</td>
      <td>${actionButtons}</td>
    `;

    borrowTable.appendChild(row);
  });

  // If no borrowings, show message
  if (borrowings.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5" style="text-align: center; padding: 20px; color: #666;">No borrowed books yet</td>`;
    borrowTable.appendChild(row);
  }
}

async function returnBook(button) {
  const borrowId = button.getAttribute("data-borrow-id");
  const row = button.closest("tr");
  const bookTitle = row.cells[0].innerText;

  activeRow = row;
  activeBorrowId = borrowId;
  
  ratingBookName.innerText = bookTitle;
  ratingComment.value = "";
  setSelectedRating(0);
  ratingModal.classList.remove("hidden");
}

async function renewBook(button) {
  const borrowId = button.getAttribute("data-borrow-id");
  const row = button.closest("tr");
  
  try {
    button.disabled = true;
    button.textContent = "Renewing...";
    
    const result = await renewBorrow(borrowId);
    
    // Update the due date in the row
    const dueFormattedDate = formatDate(result.due_date);
    row.cells[3].innerText = dueFormattedDate;
    
    row.style.backgroundColor = "#3A7D44";
    row.style.color = "white";

    setTimeout(() => {
      row.style.backgroundColor = "";
      row.style.color = "";
      button.disabled = false;
      button.textContent = "Renew";
    }, 500);
  } catch (error) {
    button.disabled = false;
    button.textContent = "Renew";
  }
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
  if (!activeRow || !activeBorrowId) return;

  if (!selectedRating) {
    alert("Please choose a rating before returning the book.");
    return;
  }

  const returnBook_button = activeRow.querySelector("button:first-child");
  returnBook_button.disabled = true;
  returnBook_button.textContent = "Returning...";

  const comment = ratingComment.value.trim();

  // Return the book via API
  returnBorrowedBook(activeBorrowId).then(() => {
    // Store rating locally
    const title = activeRow.cells[0].innerText;
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
      // Reload the borrowed books list
      loadBorrowedBooks();
    }, 300);
  }).catch(() => {
    returnBook_button.disabled = false;
    returnBook_button.textContent = "Return";
  });
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

// Load borrowed books on page load
window.addEventListener("DOMContentLoaded", () => {
  loadBorrowedBooks();
});

// Export functions to global scope for inline onclick handlers
window.returnBook = returnBook;
window.renewBook = renewBook;



