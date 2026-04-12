let books = [];

async function loadBooks(){
    const response = await fetch("/data/books.json");
    books = await response.json();
}

const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

function displayBooks(bookList) {
    let table = document.getElementById("booksTable");

    table.innerHTML = ""; 

    bookList.forEach(book => {
        const isBorrowed = borrowedBooks.includes(+book.id);

        table.innerHTML += `
        <tr>
            <td>${book.title}</td>
            <td><img src="https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg" width="50"></td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.available? "Available" : "Unavailable"}</td>
            <td>
                <a href="view_book.html?id=${book.id}">View</a>
          <button onclick="handleBorrow(${book.id})" ${isBorrowed ? "disabled" : ""} style="background-color: ${isBorrowed ? "gray" : ""}; cursor: ${isBorrowed ? "not-allowed" : "pointer"};">${isBorrowed ? "Already Borrowed" : "Borrow"}</button>
            </td>
        </tr>
        `;
    });
}


function filterBooks() {
    let search = document.getElementById("searchInput").value.toLowerCase();
    let category = document.getElementById("categoryFilter").value;

    let filtered = books.filter(book => {
        let matchesSearch =
            book.title.toLowerCase().includes(search) ||
            book.author.toLowerCase().includes(search);

        let matchesCategory =
            category === "All" || book.category === category;

        return matchesSearch && matchesCategory;
    });

    displayBooks(filtered);
}

window.onload = async function () {
    await loadBooks();
    displayBooks(books);
};
