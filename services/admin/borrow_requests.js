import { customFetch } from "/utils/api.js";

export async function getBorrowRequests(params = {}) {
  try {
    let url = `/api/admin/borrow-requests?`;
    const querystring = new URLSearchParams(params).toString();
    const response = await customFetch(url + querystring, {
      method: "GET",
    });
    let { data } = await response.json();

    return { data: data };
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

export async function approveRequest(id) {
  try {
    let url = `/api/admin/borrow-requests/${id}/`;
    const response = await customFetch(url, {
      method: "PATCH",
      body: JSON.stringify({action: "approve"}),
    });
    let { data } = await response.json();

    return { data: data };
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

export async function rejectRequest(id, message) {
  try {
    let url = `/api/admin/borrow-requests/${id}/`;
    const response = await customFetch(url, {
      method: "PATCH",
      body: JSON.stringify({action: "reject", rejection_reason: message}),
    });
    let { data } = await response.json();

    return { data: data };
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

export async function getLatestBorrowRequests(limit = 5) {
  try {
    const response = await fetch("/data/borrow_requests.json");
    let data = await response.json();
    data = data.slice(0, limit);
    return { data: data };
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}