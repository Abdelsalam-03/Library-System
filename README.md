## Requirements

Online library website helps the users to view and search for books to borrow. The website should have 2 types of users: either an admin or a user. Each can sign up and choose whether to be an admin or user.

Admin can:

1. Sign up (fill in form “username, password, confirm password, email and is_admin”)
2. Login
3. Add new books
   (Books includes ID, book name, author, category, description)
4. View list of available books.
5. Select a book and edit its details.
6. Delete a book

User can:

1. Sign up (fill in form “username, password, confirm password, email and is_admin”)
2. Login
3. Search for books by titles or author or category and results are displayed accordingly.
4. View list of available books marked either available or not available in case it is borrowed by a user.
5. Select a book and view its details in a book page.
6. Borrow a book (only applicable in case a book is available).
7. View list of borrowed books for that user.

   • Online library website should have a navigation bar.
   • The navigation bar should be adjusted dynamically based on the logged in user.
   • The navigation bar should be accessible from all web pages

## Pages

/index.html -> home page (welcome page that introduce the project and provide links)

/pages/login.html -> login page

/pages/register.html -> register page

/pages/books.html -> books list page (all available books)

/pages/book.html?id=[id] -> book details page

/pages/borrowed-books.html -> borrowed books page (user can access their borrowed books from here)

#### Admin Pages

/admin/add-book.html -> add book page (only available for admin)

/admin/books.html -> books list page (all available books with options of update and delete and 'borrowed by')

/admin/update-book.html?id=[id] -> update book page

## Suggested Folder Structure (by AI)

```
my-multiPage-project/
├── pages/               (Keep your additional HTML pages here)
│   ├── about.html
│   ├── contact.html
│   └── dashboard.html
├── assets/              (Global files shared across all pages)
│   ├── css/
│   │   └── global.css   (Styles for the layout, typography, navbar, etc.)
│   ├── js/
│   │   ├── global.js    (Scripts that run everywhere, like a mobile menu)
│   │   └── api.js       (Shared functions to communicate with your backend)
│   └── images/          (All shared pictures)
├── page-assets/         (Files specific to individual pages)
│   ├── css/
│   │   └── dashboard.css (Styles ONLY for the dashboard)
│   └── js/
│       ├── about.js      (Logic ONLY for the about page)
│       └── dashboard.js
└── index.html           (Your main home page)
```

## API
