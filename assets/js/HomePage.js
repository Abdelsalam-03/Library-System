// dashboard.js
// Reads the user object from localStorage (set by auth.js on login)
// and the borrowed books from localStorage (set by borrow.js).
// All data keys match the rest of the project.

// ── Static book catalogue (same as books.js) ──────────────────────────────
// Replace this with an API call if you add a backend endpoint later.
const allBooks = [
    {
        title: "Clean Code",
        image: "../assets/images/book-cover.avif",
        author: "Robert C. Martin",
        category: "Programming",
        status: "Available",
    },
    {
        title: "The Hobbit",
        image: "../assets/images/download.jpg",
        author: "J.R.R. Tolkien",
        category: "Fantasy",
        status: "Available",
    },
    {
        title: "A Brief History of Time",
        image: "../assets/images/images.webp",
        author: "Stephen Hawking",
        category: "Science",
        status: "Unavailable",
    },
];

// ── Static borrowed list ───────────────────────────────────────────────────
// Replace with an API call once a backend endpoint exists.
// Format matches what borrowed.html / borrow.js uses.
const borrowedBooks = [
    {
        title: "Season of Migration to the North",
        author: "Tayeb Salih",
        borrowedOn: "2026-03-10",
        dueDate: "2026-03-20",
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        borrowedOn: "2026-03-05",
        dueDate: "2026-03-15",
    },
    {
        title: "The Old Man and The Sea",
        author: "Ernest Hemingway",
        borrowedOn: "2026-02-20",
        dueDate: "2026-03-01",
        returned: true,
    },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function getUser() {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch {
        return null;
    }
}

function getStoredRatings() {
    try {
        return JSON.parse(localStorage.getItem("returnedBookRatings")) || [];
    } catch {
        return [];
    }
}

function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function bookStatus(dueDate, returned) {
    if (returned) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0)  return { label: "Overdue",  cls: "badge-overdue", type: "overdue" };
    if (diffDays <= 5) return { label: "Due soon", cls: "badge-due",     type: "due" };
    return              { label: "On time",  cls: "badge-ok",      type: "ok" };
}

function initials(name) {
    if (!name) return "?";
    return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join("");
}

// ── Populate user info ─────────────────────────────────────────────────────
function renderUserHero() {
    const user = getUser();
    if (!user) return;

    document.getElementById("user_avatar").textContent = initials(user.name || user.email);
    document.getElementById("welcome_msg").textContent  = `Welcome back, ${user.name || "User"}`;
    document.getElementById("user_email").textContent   = user.email || "";
}

// ── Populate metrics ───────────────────────────────────────────────────────
function renderMetrics() {
    const active   = borrowedBooks.filter(b => !b.returned);
    const overdue  = active.filter(b => bookStatus(b.dueDate)?.type === "overdue");
    const due      = active.filter(b => bookStatus(b.dueDate)?.type === "due");
    const total    = borrowedBooks.length;

    document.getElementById("metric_borrowed").textContent = active.length;
    document.getElementById("metric_due").textContent      = due.length;
    document.getElementById("metric_overdue").textContent  = overdue.length;
    document.getElementById("metric_total").textContent    = total;
}

// ── Populate borrowed table ────────────────────────────────────────────────
function renderBorrowedTable() {
    const tbody  = document.getElementById("borrow_tbody");
    const active = borrowedBooks.filter(b => !b.returned);

    if (active.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-row">No books currently borrowed.</td></tr>`;
        return;
    }

    tbody.innerHTML = active.map(b => {
        const st = bookStatus(b.dueDate);
        const badge = st ? `<span class="badge ${st.cls}">${st.label}</span>` : "";
        const actions = st?.type === "overdue"
            ? `<button class="btn-primary" onclick="location.href='borrowed.html'">Reborrow</button>`
            : `<button onclick="location.href='borrowed.html'">Return</button>
               <button onclick="location.href='borrowed.html'">Renew</button>`;
        return `
        <tr>
            <td>${b.title}</td>
            <td>${b.author}</td>
            <td>${formatDate(b.dueDate)}</td>
            <td>${badge}</td>
            <td>${actions}</td>
        </tr>`;
    }).join("");
}

// ── Activity feed ──────────────────────────────────────────────────────────
function renderActivity() {
    const ratings = getStoredRatings();
    const list    = document.getElementById("activity_list");

    // Build events from borrow data + stored ratings
    const events = [];

    borrowedBooks.forEach(b => {
        events.push({
            type: "borrow",
            text: `Borrowed "${b.title}"`,
            date: b.borrowedOn,
        });
        if (b.returned) {
            events.push({
                type: "return",
                text: `Returned "${b.title}"`,
                date: b.dueDate,
            });
        }
    });

    ratings.forEach(r => {
        events.push({
            type: "rate",
            text: `Rated "${r.title}" — ${r.score} star${r.score !== 1 ? "s" : ""}`,
            date: r.returnedAt,
        });
    });

    // Check overdue
    borrowedBooks.filter(b => !b.returned && bookStatus(b.dueDate)?.type === "overdue").forEach(b => {
        events.push({
            type: "overdue",
            text: `"${b.title}" is overdue`,
            date: b.dueDate,
        });
    });

    // Sort by date descending
    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (events.length === 0) {
        list.innerHTML = `<li class="activity-item empty-text">No recent activity.</li>`;
        return;
    }

    const dotClass = { borrow: "dot-borrow", return: "dot-return", overdue: "dot-overdue", renew: "dot-renew", rate: "dot-rate" };

    list.innerHTML = events.slice(0, 8).map(e => `
        <li class="activity-item">
            <span class="activity-dot ${dotClass[e.type] || "dot-borrow"}"></span>
            <span class="activity-text">${e.text}</span>
            <span class="activity-time">${formatDate(e.date)}</span>
        </li>
    `).join("");
}

// ── Quick book search ──────────────────────────────────────────────────────
function dashSearch() {
    const query       = document.getElementById("dash_search").value.toLowerCase().trim();
    const resultsWrap = document.getElementById("dash_results_wrap");
    const noResults   = document.getElementById("dash_no_results");
    const tbody       = document.getElementById("dash_results_tbody");

    if (!query) {
        resultsWrap.style.display = "none";
        noResults.style.display   = "none";
        return;
    }

    const filtered = allBooks.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        resultsWrap.style.display = "none";
        noResults.style.display   = "block";
        return;
    }

    noResults.style.display   = "none";
    resultsWrap.style.display = "block";

    tbody.innerHTML = filtered.map(b => {
        const available = b.status === "Available";
        const badge = available
            ? `<span class="badge badge-ok">Available</span>`
            : `<span class="badge badge-overdue">Unavailable</span>`;
        const action = available
            ? `<button class="btn-primary" onclick="location.href='view_book.html'">Borrow</button>`
            : `<button disabled style="opacity:.5;cursor:not-allowed;">Unavailable</button>`;
        return `
        <tr>
            <td>${b.title}</td>
            <td>${b.author}</td>
            <td>${badge}</td>
            <td>${action}</td>
        </tr>`;
    }).join("");
}

// Allow search on Enter key
document.getElementById("dash_search").addEventListener("keydown", e => {
    if (e.key === "Enter") dashSearch();
});

// ── Logout (mirrors auth.js pattern) ──────────────────────────────────────
document.getElementById("logout_btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.assign("/index.html");
});

// ── Init ───────────────────────────────────────────────────────────────────
renderUserHero();
renderMetrics();
renderBorrowedTable();
renderActivity();