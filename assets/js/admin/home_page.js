import { getBooksStats, getBooks } from "/services/admin/books.js";
import { getLatestBorrowRequests } from "/services/admin/borrow_requests.js";
import { getDashboard } from "/services/admin/dashboard.js";

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

  fetchDashboard();
});

async function fetchDashboard() {
  try {
    let response = await getDashboard();
    const values = [
      response.data.total_books,
      response.data.available_books,
      response.data.borrowed_books,
      response.data.total_customers,
    ];
    renderStatCards(values);
    renderRecentBooks(response.data.recent_books);
    renderRecentActivity(response.data.recent_borrow_requests);
  } catch (error) {
    console.log(error);
  }
}

function renderStatCards(values) {
  const statCards = document.querySelectorAll(".stat_value");

  statCards.forEach((card, i) => {
    if (values[i] !== undefined) {
      animateCounter(card, values[i]);
    }
  });
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

function renderRecentBooks(books) {
  const list = document.getElementById("recent_books_list");
  if (!list) return;

  if (!books.length) {
    list.innerHTML = `<p style="color:var(--light-text-color);font-size:13px;">No books found.</p>`;
    return;
  }

  list.innerHTML = books
    .map(
      (book) => `
    <div class="recent_book_item">
      <div class="book_thumb"><i class="fa-solid fa-book"></i></div>
      <div class="book_meta">
        <h5>${book.title}</h5>
        <span>${book.author} · ${book.available}</span>
      </div>
    </div>
  `,
    )
    .join("");
}

function renderRecentActivity(requests) {
  const tbody = document.getElementById("activity_tbody");
  if (!tbody) return;

  if (!requests.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--light-text-color);padding:1rem;">No recent activity.</td></tr>`;
    return;
  }

  tbody.innerHTML = requests
    .map(
      (entry) => `
    <tr>
      <td><a href="/pages/admin/customer.html?customer=${entry.user_id}">${entry.username}</a></td>
      <td><a href="/pages/admin/view_book.html?id=${entry.book_id}">${entry.book_title}</a></td>
      <td>${entry.requested_at}</td>
      <td><span class="badge ${entry.status}">${entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}</span></td>
    </tr>
  `,
    )
    .join("");
}
