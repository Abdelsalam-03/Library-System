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
                <li><a href="index.html">Home</a></li>
                <li><a href="view_books.html">View Books</a></li>
                <li><a href="add_book.html">Add Book</a></li>
                <li><a href="customers.html">Customers</a></li> `
                : `       
                <li><a href="books.html">Books</a></li>
                <li><a href="borrowed.html">Borrowed Books</a></li>
            `
            }
                <li><a href="profile.html">Profile</a></li>
            </ul>
            <button>Log out</button>
        </nav>
    
    `;
  document.querySelector("body").prepend(header);
}
