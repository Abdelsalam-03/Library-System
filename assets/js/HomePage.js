// HomePage.js
// Place this file at: /assets/js/HomePage.js
// Connects to Django REST API at http://127.0.0.1:8000
import { getMe } from "/services/auth.js";

const API_BASE = "http://127.0.0.1:8000/api";

// ── Token helper ───────────────────────────────────────────────────────────
function getToken() {
    return localStorage.getItem("access");
}


// ── Fetch dashboard data ───────────────────────────────────────────────────
async function fetchDashboard() {
    const token = getToken();

    if (!token) {
        //window.location.href = "/index.html";
        console.log("gg");
        return null;
    }

    try {
        const res = await fetch(`${API_BASE}/dashboard/`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            //window.location.href = "/index.html";
            console.log("gg");
            return null;
        }

        if (!res.ok) {
            console.error("Dashboard fetch failed:", res.status);
            console.log("gg");
            return null;
        }

        const json = await res.json();
        console.log(json);
        renderBorrowedTable(json.data.recent_borrowed)
        const data = {currently_borrowing: json.data.currently_borrowing ,due_soon:json.data.due_soon ,over_due:json.data.over_due,total_borrowed:json.data.total_borrowed}
        renderMetrics(data)
        return json.data; // unwrap { success, data, errors, status_code }

    } catch (err) {
        console.error("Network error:", err);
        console.log("gg")
        return null;
    }
}

// ── Fetch books for search ─────────────────────────────────────────────────
async function fetchBooks(query = "") {
    const token = getToken();

    try {
        const url = `${API_BASE}/books/?search=${encodeURIComponent(query)}`;

        const res = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) return [];
        const json = await res.json();
        return json.data || json;

    } catch (err) {
        console.error("Books fetch failed:", err);
        return [];
    }
}

// ── Helpers ────────────────────────────────────────────────────────────────
function getUser() {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch {
        return null;
    }
}

function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// status from backend: APPROVED, OVERDUE, RETURNED, PENDING, REJECTED
function bookStatus(status, dueDate) {
    if (status === "RETURNED") return null;
    if (status === "OVERDUE") return { label: "Overdue", cls: "badge-overdue", type: "overdue" };
    if (status === "PENDING") return { label: "Pending", cls: "badge-due", type: "pending" };
    if (status === "REJECTED") return { label: "Rejected", cls: "badge-overdue", type: "rejected" };

    if (status === "APPROVED" && dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return { label: "Overdue", cls: "badge-overdue", type: "overdue" };
        if (diffDays <= 5) return { label: "Due soon", cls: "badge-due", type: "due" };
        return { label: "On time", cls: "badge-ok", type: "ok" };
    }

    return { label: "On time", cls: "badge-ok", type: "ok" };
}

function initials(name) {
    if (!name) return "?";
    return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join("");
}

// ── Render user hero ───────────────────────────────────────────────────────
async function renderUserHero() {
    const user = await getMe();
    if (!user) return;
    console.log(user)

    document.getElementById("user_avatar").textContent = initials(user.username || user.email);
    document.getElementById("welcome_msg").textContent = `Welcome back, ${user.first_name || "User"}`;
    document.getElementById("user_email").textContent = user.email || "";
}

// ── Render metrics ─────────────────────────────────────────────────────────
// Backend fields: currently_borrowing, due_soon, over_due, total_borrowed
function renderMetrics(data) {
    document.getElementById("metric_borrowed").textContent = data.currently_borrowing ?? 0;
    document.getElementById("metric_due").textContent = data.due_soon ?? 0;
    document.getElementById("metric_overdue").textContent = data.over_due ?? 0;
    document.getElementById("metric_total").textContent = data.total_borrowed ?? 0;
}

// ── Render borrowed table ──────────────────────────────────────────────────
// Backend fields: book_title, book_author, due_date, status
function renderBorrowedTable(recentBorrowed) {
    const tbody = document.getElementById("borrow_tbody");

    const active = (recentBorrowed || []).filter(
        b => b.status !== "RETURNED" && b.status !== "REJECTED"
    );

    if (active.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-row">No books currently borrowed.</td></tr>`;
        return;
    }

    tbody.innerHTML = active.map(b => {
        const st = bookStatus(b.status, b.due_date);
        const badge = st ? `<span class="badge ${st.cls}">${st.label}</span>` : "";

        const actions = st?.type === "overdue"
            ? `<button class="btn-primary" onclick="location.href='borrowed.html'">Reborrow</button>`
            : `<button onclick="location.href='borrowed.html'">Return</button>
               <button onclick="location.href='borrowed.html'">Renew</button>`;

        return `
        <tr>
            <td>${b.book_title || "—"}</td>
            <td>${b.book_author || "—"}</td>
            <td>${formatDate(b.due_date)}</td>
            <td>${badge}</td>
            <td>${actions}</td>
        </tr>`;
    }).join("");
}

// ── Render activity feed ───────────────────────────────────────────────────
// Backend fields: book_title, status, requested_at, due_date
function renderActivity(recentBorrowed) {
    const list = document.getElementById("activity_list");
    const events = [];

    (recentBorrowed || []).forEach(b => {
        events.push({
            type: "borrow",
            text: `Borrowed "${b.book_title}"`,
            date: b.requested_at,
        });

        if (b.status === "RETURNED") {
            events.push({
                type: "return",
                text: `Returned "${b.book_title}"`,
                date: b.due_date,
            });
        }

        if (b.status === "OVERDUE") {
            events.push({
                type: "overdue",
                text: `"${b.book_title}" is overdue`,
                date: b.due_date,
            });
        }
    });

    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (events.length === 0) {
        list.innerHTML = `<li class="activity-item empty-text">No recent activity.</li>`;
        return;
    }

    const dotClass = {
        borrow: "dot-borrow",
        return: "dot-return",
        overdue: "dot-overdue",
        renew: "dot-renew",
        rate: "dot-rate",
    };

    list.innerHTML = events.slice(0, 8).map(e => `
        <li class="activity-item">
            <span class="activity-dot ${dotClass[e.type] || "dot-borrow"}"></span>
            <span class="activity-text">${e.text}</span>
            <span class="activity-time">${formatDate(e.date)}</span>
        </li>
    `).join("");
}

// ── Book search ────────────────────────────────────────────────────────────
async function dashSearch() {
    const query = document.getElementById("dash_search").value.trim();
    const resultsWrap = document.getElementById("dash_results_wrap");
    const noResults = document.getElementById("dash_no_results");
    const tbody = document.getElementById("dash_results_tbody");

    if (!query) {
        resultsWrap.style.display = "none";
        noResults.style.display = "none";
        return;
    }

    tbody.innerHTML = `<tr><td colspan="4" class="empty-row">Searching…</td></tr>`;
    resultsWrap.style.display = "block";
    noResults.style.display = "none";

    const books = await fetchBooks(query);

    const filtered = books.filter(b =>
        (b.title || "").toLowerCase().includes(query.toLowerCase()) ||
        (b.author || "").toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        resultsWrap.style.display = "none";
        noResults.style.display = "block";
        return;
    }

    resultsWrap.style.display = "block";
    noResults.style.display = "none";

    tbody.innerHTML = filtered.map(b => {
        const isAvailable = b.available > 0;
        const badge = isAvailable
            ? `<span class="badge badge-ok">Available</span>`
            : `<span class="badge badge-overdue">Unavailable</span>`;
        const action = isAvailable
            ? `<button class="btn-primary" onclick="location.href='view_book.html?id=${b.id}'">Borrow</button>`
            : `<button disabled style="opacity:.5;cursor:not-allowed;">Unavailable</button>`;
        return `
        <tr>
            <td>${b.title || "—"}</td>
            <td>${b.author || "—"}</td>
            <td>${badge}</td>
            <td>${action}</td>
        </tr>`;
    }).join("");
}

// Search on Enter key
document.getElementById("dash_search").addEventListener("keydown", e => {
    if (e.key === "Enter") dashSearch();
});

// ── Logout ─────────────────────────────────────────────────────────────────
document.getElementById("logout_btn")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/index.html";
});

// ── Init ───────────────────────────────────────────────────────────────────
async function init() {
    await renderUserHero();
    await fetchDashboard();
    
}

init();