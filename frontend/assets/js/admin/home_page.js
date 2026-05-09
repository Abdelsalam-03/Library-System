import { getBooksStats, getBooks } from "/services/admin/books.js";
import { getLatestBorrowRequests } from "/services/admin/borrow_requests.js";

document.addEventListener("DOMContentLoaded", () => {

  // Highlight active nav link
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split("/").pop() || "index.html";
  document.querySelectorAll("header nav ul li a").forEach((link) => {
    const href = link.getAttribute("href");
    const linkPage = href.split("/").pop();
    if (linkPage === currentPage || currentPath.endsWith(href)) {
      link.classList.add("active");
    }
  });

  // Logout confirmation
  // const logoutBtn = document.querySelector("header nav button");
  // if (logoutBtn) {
  //   logoutBtn.addEventListener("click", () => {
  //     const confirmed = confirm("Are you sure you want to log out?");
  //     if (confirmed) {
  //       window.location.href = "login.html";
  //     }
  //   });
  // }

  // Fetch real data from services
  fetchBooksStats();
  fetchRecentBooks();
  fetchRecentActivity();
});

// ===== Fetch & fill stats cards =====
// Uses same getBooksStats() service as view_books.js — numbers will always match
async function fetchBooksStats() {
  try {
    const response = await getBooksStats();
    const stats = response.data;

    const statCards = document.querySelectorAll(".stat_value");
    const values = [
      stats.total_books,
      stats.available_books,
      stats.borrowed_books,
      stats.total_customers,
    ];

    statCards.forEach((card, i) => {
      if (values[i] !== undefined) {
        animateCounter(card, values[i]);
      }
    });

  } catch (error) {
    console.log("Stats error:", error);
  }
}

// ===== Counter animation =====
function animateCounter(el, target) {
  const duration = 900;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;

  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = current;
  }, 16);
}

// ===== Fetch 5 most recent books =====
async function fetchRecentBooks() {
  try {
    const response = await getBooks({});
    const books = response.data.slice(0, 5);
    renderRecentBooks(books);
  } catch (error) {
    console.log("Recent books error:", error);
  }
}

function renderRecentBooks(books) {
  const list = document.getElementById("recent_books_list");
  if (!list) return;

  if (!books.length) {
    list.innerHTML = `<p style="color:var(--light-text-color);font-size:13px;">No books found.</p>`;
    return;
  }

  list.innerHTML = books.map((book) => `
    <div class="recent_book_item">
      <div class="book_thumb"><i class="fa-solid fa-book"></i></div>
      <div class="book_meta">
        <h5>${book.title}</h5>
        <span>${book.author} · ${book.genre}</span>
      </div>
    </div>
  `).join("");
}

// ===== Fetch latest 5 borrow requests =====
async function fetchRecentActivity() {
  try {
    const response = await getLatestBorrowRequests(5);
    renderRecentActivity(response.data);
  } catch (error) {
    console.log("Activity error:", error);
  }
}

function renderRecentActivity(requests) {
  const tbody = document.getElementById("activity_tbody");
  if (!tbody) return;

  if (!requests.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--light-text-color);padding:1rem;">No recent activity.</td></tr>`;
    return;
  }

  tbody.innerHTML = requests.map((entry) => `
    <tr>
      <td><a href="/pages/admin/customer.html?customer=${entry.user_id}">${entry.user_name}</a></td>
      <td><a href="/pages/admin/view_book.html?id=${entry.book_id}">${entry.book_name}</a></td>
      <td>${entry.request_date}</td>
      <td><span class="badge ${entry.status}">${entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}</span></td>
    </tr>
  `).join("");
}