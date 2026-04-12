import { getUser } from "/services/auth.js";

fetchUser();

async function fetchUser() {
  try {
    const user = await getUser();
    addHeader(user);
  } catch (error) {
    console.log("unauthorized");
  }
}

function addHeader(user) {
  const header = document.createElement("header");
  header.innerHTML = `
        <a href="/" class="logo">
            <img src="/assets/images/logo.png" alt="logo">
        </a>

        <nav>
            <ul>
            ${
              user.is_admin
                ? `
                <li><a href="/pages/admin/index.html">Home</a></li>
                <li><a href="/pages/admin/view_books.html">View Books</a></li>
                <li><a href="/pages/admin/borrow_requests.html">Borrow Requests</a></li>
                <li><a href="/pages/admin/add_book.html">Add Book</a></li>
                <li><a href="/pages/admin/customers.html">Customers</a></li> `
                : `       
                <li><a href="/pages/index.html">Home</a></li>
                <li><a href="/pages/books.html">Books</a></li>
                <li><a href="/pages/borrowed.html">Borrowed Books</a></li>
            `
            }
                <li><a href="/pages/profile.html">Profile</a></li>
            </ul>
            <button onclick="logout()">log out</button>
        </nav>
    
    `;
  document.querySelector("body").prepend(header);
}
