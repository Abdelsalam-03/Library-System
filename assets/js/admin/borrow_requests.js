import { getBorrowRequests, approveRequest, rejectRequest } from "/services/admin/borrow_requests.js";
import { showToast } from "/utils/toast.js"

let filters = {status: "pending"};


const statusField = document.getElementById("status");

const requestsTable = document.querySelector("#requests_table tbody");

requestsTable.addEventListener("click", (event) => {
  const target = event.target;

  // Ignore links -> let them work normally
  if (target.closest("a")) {
    return;
  }

  // Approve button
  if (target.closest(".approve")) {
    const button = target.closest(".approve");
    const requestId = button.dataset.id;

    approve(requestId);
    return;
  }

  // Delete / Reject button
  if (target.closest(".delete")) {
    const button = target.closest(".delete");
    const requestId = button.dataset.id;
    console.log("Rejecting")
    const reason = prompt("Enter rejection reason:");
    if (reason === null) {
      return
    }
    reject(requestId, reason);
  }
});

await fetchRequests(filters);

statusField.addEventListener("change", (e) => updateFilters({status: e.target.value}));

function updateFilters(newValue) {
  filters = { ...filters, ...newValue };
  fetchRequests(filters);
}

async function fetchRequests(params = {}) {
  try {
    let response = await getBorrowRequests(params);
    fillRequestsTable(response.data);
  } catch (error) {
    console.log(error);
  }
}

function fillRequestsTable(requests) {
  if (!requests.length) {
    requestsTable.innerHTML = `<tr><td class="empty" colspan="6">No Requests found</td></tr>`;
    return;
  }
  let body = document.createDocumentFragment();
  
  requests.forEach((request) => {
    const row = document.createElement("tr");
    row.dataset.id = request.id;
    row.innerHTML = `
    <td><a href="/pages/admin/customer.html?customer=${request.user}">${request.username}</a></td>
    <td class="title"><a href="/pages/admin/view_book.html?id=${request.book}">${request.book_title}</a></td>
    <td>${request.requested_at}</td>
    <td>${request.available_copies}</td>
    <td>${request.status}</td>
    <td class="actions">
      ${request.status == "pending"?  `
        <button class="approve" data-id="${request.id}">&#10003;</button>
        <button class="delete" data-id="${request.id}" ">&times;</button>` : `<span></span>`}
    </td>
  `;
    body.appendChild(row);
  });
  requestsTable.innerHTML = "";
  requestsTable.appendChild(body);
}

function clearFilters() {
  fetchRequests({});
}

async function approve(id) {
  try {
    console.log("Approving");
    let response = await approveRequest(id);
    if (response.data) {
      showToast("Request Approved Successfully.", "success");
    } else {
      showToast("Couldn't approve request.", "error");
    }
  } catch (error) {
    console.log("error happend")
    console.log(error);
  }
}

async function reject(id, message) {
  try {
    console.log("Rejecting");
    let response = await rejectRequest(id, message);
    if (response.data) {
      showToast("Request Rejected Successfully.", "success");
    } else {
      showToast("Couldn't reject request.", "error");
    }
  } catch (error) {
    console.log("error happend")
    console.log(error);
  }
}