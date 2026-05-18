import { customFetch } from "/utils/api.js";
import { borrowBook } from "/services/borrow.js";

const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

async function getBook(id) {
  try {
    const response = await customFetch(`/api/books/${id}/`);
    const {data} = await response.json();
  
    return data;
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

window.borrow = async (id) => {
  try {
    let response = await borrowBook(id)
    console.log(response);
  } catch (error) {
    
  }
}


await fetchBook();

async function fetchBook() {
  try {
    let response = await getBook(bookId);
    fillBookInformation(response);
  } catch (error) {
    console.log(error);
  }
}


function fillBookInformation(currentBook){
  const titleTag = document.querySelector("h2");
  const detailsContainer = document.querySelector(".book-details");

    titleTag.textContent = currentBook.title;
    detailsContainer.innerHTML = `
        <img
              class="book-cover"
              src="https://covers.openlibrary.org/b/isbn/${currentBook.isbn}-L.jpg"
              alt="clean-code-in-javascript"
            />
    
            <div class="details">
              <p>
                <span> Author: </span>
                ${currentBook.author}
              </p>
    
              <p>
                <span> Category: </span>
                ${currentBook.genre.name}
              </p>
    
              <p>
                <span> Status: </span>
                ${currentBook.available ? "Available" : "Unavailable"}
              </p>
    
              <p style="width: 400px">
                <span> Description: </span>
                ${currentBook.description}
              </p>
    
              <p>
                <span> Available Copies: </span>
                ${currentBook.available}
              </p>
    
              <p>
                <span> Publication Year: </span>
                ${currentBook.year}
              </p>
    
              <button onclick="borrow(${currentBook.id})" ${currentBook.available <= 0 ? "disabled" : ""} style="background-color: ${currentBook.available <= 0 ? "gray" : ""}; cursor: ${currentBook.available <= 0 ? "not-allowed" : "pointer"};">${currentBook.available <= 0 ? "Sorry but it is not available" : "Borrow"}</button>
            </div>
    `;
}
