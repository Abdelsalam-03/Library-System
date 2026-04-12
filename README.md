# 📚 Library System

A full-featured, browser-based library management web application built with vanilla HTML, CSS, and JavaScript. The system supports two roles — **Admin** and **User** — each with a dedicated experience for managing and borrowing books.

> **IS231: Web Technology** — Cairo University, Faculty of Computer Science and Artificial Intelligence  
> **Team ID:** 16 | **Supervisors:** Dr. Neamat El Tazi & Dr. Mohamed Nour El-Din

---

## ✨ Features

### 👤 User Features
- **Sign Up / Login** — Create an account or log in with email and password.
- **Browse Books** — View all available books in a searchable, filterable table.
- **Search & Filter** — Search by title or author, and filter by genre/category.
- **Book Details** — View full details for any book (title, author, genre, ISBN, year, description).
- **Borrow a Book** — Request to borrow any available book with a single click.
- **My Borrowed Books** — View all borrow requests and their current status (pending / approved / rejected).
- **Profile Management** — Update display name and change password.

### 🔧 Admin Features
- **Admin Dashboard** — Overview of library statistics (total books, available, borrowed, genres).
- **Manage Books** — Full CRUD: add, view, edit, and delete books from the catalog.
- **Borrow Requests** — Review all borrow requests; approve or reject them with sorting and filtering.
- **Customer Management** — View all registered users and inspect individual customer profiles.
- **Dynamic Navigation** — The navbar adapts automatically to the logged-in user's role.

### 🛠️ General
- **Toast Notifications** — Non-blocking feedback messages for every action.
- **Role-based Routing** — Pages are guarded so users cannot access admin routes and vice versa.
- **Persistent Session** — User session is stored in `localStorage` and survives page refreshes.

---

## 🗂️ Project Structure

```
Library-System/
├── index.html                   # Welcome / landing page
├── style.css                    # Landing page styles
├── pages/
│   ├── auth/
│   │   ├── login.html           # Login page
│   │   └── signup.html          # Sign-up page
│   ├── admin/
│   │   ├── index.html           # Admin dashboard (stats overview)
│   │   ├── view_books.html      # Admin book list (edit / delete)
│   │   ├── add_book.html        # Add a new book
│   │   ├── edit_book.html       # Edit an existing book
│   │   ├── view_book.html       # Admin view of a single book
│   │   ├── borrow_requests.html # Manage borrow requests
│   │   ├── customers.html       # List of all registered users
│   │   └── customer.html        # Individual customer profile (admin view)
│   ├── books.html               # User book browser
│   ├── borrowed.html            # User's borrow history / requests
│   ├── view_book.html           # Book detail page (user)
│   ├── profile.html             # User profile (name & password update)
│   └── team-info.html           # Project team information
├── components/
│   └── header.js                # Dynamic header/navbar component
├── services/
│   ├── auth.js                  # Login, signup, getUser helpers
│   ├── profile.js               # Profile update helpers
│   └── admin/
│       ├── books.js             # Book CRUD + stats service
│       ├── borrow_requests.js   # Borrow request service
│       └── genres.js            # Genre list service
├── utils/
│   └── toast.js                 # Toast notification utility
├── assets/
│   ├── css/                     # Page-specific and global stylesheets
│   ├── js/                      # Page-specific JavaScript files
│   └── images/                  # Logos and images
└── data/
    ├── books.json               # Book catalog (mock database)
    ├── users.json               # User accounts (mock database)
    └── borrow_requests.json     # Borrow request records (mock database)
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- A local web server (required because the app uses ES Modules and `fetch` to load JSON data)

### Running the App

**Option 1 — VS Code Live Server (recommended)**
1. Open the project folder in VS Code.
2. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
3. Right-click `index.html` → **Open with Live Server**.
4. The app will open at `http://127.0.0.1:5500`.

**Option 2 — Python built-in server**
```bash
# Python 3
cd Library-System
python -m http.server 8080
# Then open http://localhost:8080
```

**Option 3 — Node.js `serve`**
```bash
npx serve .
```

### Demo Credentials

| Role  | Email | Password |
|-------|-------|----------|
| Admin | `admin@gmail.com` | `admin1234` |
| User  | `user@gmail.com`  | `user1234`  |

> ⚠️ **Note:** This project uses JSON files as a mock database. Data is read-only — changes made during a session (add/edit/delete) are **not** persisted to disk. A real backend would be needed for full persistence.

---

## 🛣️ Page Routes

### Public
| Route | Description |
|-------|-------------|
| `/index.html` | Welcome / landing page |
| `/pages/auth/login.html` | Login |
| `/pages/auth/signup.html` | Sign up |

### User (requires login)
| Route | Description |
|-------|-------------|
| `/pages/books.html` | Browse & search all books |
| `/pages/view_book.html?id=[id]` | Book detail page |
| `/pages/borrowed.html` | My borrow requests |
| `/pages/profile.html` | Update name / change password |

### Admin (requires admin login)
| Route | Description |
|-------|-------------|
| `/pages/admin/index.html` | Admin dashboard |
| `/pages/admin/view_books.html` | All books with edit / delete |
| `/pages/admin/add_book.html` | Add a new book |
| `/pages/admin/edit_book.html?id=[id]` | Edit a book |
| `/pages/admin/view_book.html?id=[id]` | Book detail (admin view) |
| `/pages/admin/borrow_requests.html` | Approve / reject requests |
| `/pages/admin/customers.html` | All registered users |
| `/pages/admin/customer.html?id=[id]` | Individual user profile |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (custom, no framework) |
| Logic | Vanilla JavaScript (ES Modules) |
| Data | Static JSON files (mock API) |
| Storage | `localStorage` (session persistence) |

---

## 📊 Data Models

### Book
```json
{
  "id": 1,
  "title": "The Silent Patient",
  "author": "Alex Michaelides",
  "genre": "Thriller",
  "ISBN": "9781250301697",
  "year": 2019,
  "copies": 10,
  "available": 10,
  "price": 14.99,
  "description": "A psychological thriller about a woman who shoots her husband and then stops speaking..."
}
```

### User
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "is_admin": false
}
```

### Borrow Request
```json
{
  "id": 1,
  "user_id": 4,
  "user_name": "Ahmed Hassan",
  "book_id": 1,
  "book_name": "The Silent Patient",
  "request_date": "2026-04-10",
  "available_copies": 3,
  "status": "pending"
}
```

---

## 💡 Ideas & Future Pages to Add

Below are suggested features and pages that would enhance the Library System:

### 📄 New Pages

| Page | Description |
|------|-------------|
| `/pages/wishlist.html` | Users save books to a personal wishlist / favourites list |
| `/pages/reading-history.html` | Full history of all books a user has ever borrowed |
| `/pages/genres.html` | Browsable gallery of all genres with book counts |
| `/pages/notifications.html` | In-app notification centre (borrow approved / rejected alerts) |
| `/pages/admin/reports.html` | Analytics dashboard: borrow trends, popular books, top users |
| `/pages/admin/user-edit.html` | Admin can edit or deactivate a user account |
| `/pages/book-reviews.html` | Users leave star ratings and written reviews for books |

### ⚙️ Feature Improvements

- **Return Book** — Add a "Return" button on the borrowed books page and update available copies accordingly.
- **Due Date & Fine Calculation** — Assign a return-by date when a borrow is approved; flag and calculate fines for overdue books.
- **Waitlist / Availability Alert** — Let users join a waitlist for unavailable books and get notified when a copy is returned.
- **Pagination** — Paginate long book lists and request tables instead of displaying everything at once.
- **Advanced Filters** — Add filters for publication year range, price range, and availability on the books page.
- **Dark Mode** — A toggle to switch between light and dark themes, persisted in `localStorage`.
- **Responsive / Mobile Layout** — Improve the CSS so the app works comfortably on phones and tablets.
- **Book Cover Images** — Display cover art for each book fetched via the Open Library Covers API or uploaded by admins.
- **Export Borrow History** — Allow users (or admins) to download their borrow history as a CSV or PDF.
- **Multi-language Support** — Add an i18n layer so the UI can be served in both Arabic and English.
- **Real Backend Integration** — Replace the static JSON files with a REST API (e.g., Node.js + Express + MongoDB) so data changes are actually persisted.
- **Email Notifications** — Send confirmation emails when a borrow request is approved or rejected.

---

## 👥 Team

| Name | Student ID |
|------|-----------|
| Abdelsalam Abdelrahman Abdelmageed Abdelrahman | 20243033 |
| Mohamed Alfatih Tarig El Tayeb | 20243029 |
| Mohammed Abdulmajeed Aljunaid | 20230713 |
| Omer Mudathir Abdallah Mohammed | 20243055 |
| Moneeb Salaheldin Bakhit | 20243085 |
| Mohammad Abdulhakim Ramadan | 20242295 |

---

## 📄 License

This project was created for educational purposes as part of the IS231 Web Technology course at Cairo University. All rights reserved by the team members listed above.
