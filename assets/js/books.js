let books = [
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
    }
];



function displayBooks(bookList) {
    let table = document.getElementById("booksTable");

    table.innerHTML = ""; 

    bookList.forEach(book => {
        table.innerHTML += `
        <tr>
            <td>${book.title}</td>
            <td><img src="${book.image}" width="50"></td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${book.status}</td>
            <td>
                <a href="view_book.html">Select</a>
                <button>Borrow</button>
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
window.onload = function () {
    displayBooks(books);
};