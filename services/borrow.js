import { customFetch, parseErrors } from "/utils/api.js";
import { showErrorToast, showSuccessToast } from "/utils/toast.js";

const API_BASE = "/api/borrowing";

// Fetch all borrowed books for the current user
export async function fetchMyBorrowings() {
  try {
    const response = await customFetch(`${API_BASE}/my-borrowings/`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(parseErrors(error).join(", "));
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching borrowings:", error);
    showErrorToast("Failed to load borrowed books");
    return [];
  }
}

// Return a borrowed book
export async function returnBorrowedBook(borrowRecordId) {
  try {
    const response = await customFetch(`${API_BASE}/return/`, {
      method: "POST",
      body: JSON.stringify({ borrow_id: borrowRecordId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(parseErrors(error).join(", "));
    }

    showSuccessToast("Book returned successfully");
    return await response.json();
  } catch (error) {
    console.error("Error returning book:", error);
    showErrorToast(error.message || "Failed to return book");
    throw error;
  }
}

// Renew a borrow record
export async function renewBorrow(borrowRecordId) {
  try {
    const response = await customFetch(`${API_BASE}/renew/`, {
      method: "POST",
      body: JSON.stringify({ borrow_id: borrowRecordId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(parseErrors(error).join(", "));
    }

    showSuccessToast("Book renewed successfully");
    return await response.json();
  } catch (error) {
    console.error("Error renewing book:", error);
    showErrorToast(error.message || "Failed to renew book");
    throw error;
  }
}

// Borrow a book (create borrow request)
export async function borrowBook(bookId) {
  try {
    const response = await customFetch(`${API_BASE}/borrow/`, {
      method: "POST",
      body: JSON.stringify({ book: bookId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(parseErrors(error).join(", "));
    }

    showSuccessToast("Borrow request submitted successfully");
    return await response.json();
  } catch (error) {
    console.error("Error borrowing book:", error);
    showErrorToast(error.message || "Failed to borrow book");
    throw error;
  }
}
