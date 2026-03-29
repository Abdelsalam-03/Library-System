export async function getBooks(params = {}) {
  try {
    const response = await fetch("/data/books.json");
    let data = await response.json();
    if (params.query != undefined) {
      data = data.filter(item => {
        return matchValue(item.title, params.query) || matchValue(item.author, params.query);
      });
    }
    if (params.genre != undefined && params.genre != "all") {
      data = data.filter(item => {
        return item.genre == params.genre;
      });
    }
    if (params.status != undefined) {
      if (params.status == "available") {
        data = data.filter(item => {
          return item.available > 0;
        });
      } else if (params.status == "unavailable") {
        data = data.filter(item => {
          return item.available == 0;
        });
      }
    }
    return { data: data };
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

export async function getBook(id) {
  try {
    const response = await fetch("/data/books.json");
    const data = await response.json();
    let found = false;
    let book = {};
    data.forEach((element) => {
      if (element.id == id) {
        found = true;
        book = element;
        return;
      }
    });
    if (found) {
      return { data: book };
    } else {
      throw {
        message: "Not Found",
        status: 404,
      };
    }
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

export async function getBooksStats() {
  try {
    const response = await fetch("/data/books.json");
    const data = await response.json();
    let available = 0;
    let borrowed = 0;
    let genres = {};
    data.forEach((element) => {
      if (element.available > 0) {
        ++available;
      }
      if (element.available < element.copies) {
        ++borrowed;
      }
      genres[element.genre] = 1;
    });
    return {
      data: {
        total_books: data.length,
        available_books: available,
        borrowed_books: borrowed,
        total_genres: Object.keys(genres).length
      }
    };
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

function matchValue(text, value) {
  const regex = new RegExp(value, "i");
  return regex.test(text);
}