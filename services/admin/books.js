import { customFetch } from "/utils/api.js";

export async function getBooks(params = {}) {
  try {
    let url = `/api/admin/books/?`;
    if(params.status){
      if(params.status == 'available') params.available = 1;
      else params.available = 0;
      delete params.status;
    }else{
      delete params.available;
    }
    const querystring = new URLSearchParams(params).toString();
    const response = await customFetch(url + querystring, {
      method: "GET",
    });
    let { data } = await response.json();
    console.log(data);

    return { data: data };
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

export async function getBook(id) {
  try {
    const response = await customFetch(`/api/admin/books/${id}/`);
    const {data} = await response.json();
    
    return data;
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

export async function getGenres() {
  try {
    const response = await customFetch(`/api/genres/`, {
      method: "GET",
    });
    const {data} = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

export async function editBook(id, book) {
  try {
    const response = await customFetch(`/api/admin/books/${id}/`, {
      method: "PUT",
      body: JSON.stringify(book),
    });
    const {data} = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

export async function getBooksStats() {
  try {
    const response = await customFetch(`/api/admin/books/stats/`, {
      method: "GET",
    });
    const {data} = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

function matchValue(text, value) {
  const regex = new RegExp(value, "i");
  return regex.test(text);
}