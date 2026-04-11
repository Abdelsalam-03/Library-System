import { getBorrowRequests } from "../../../services/admin/borrow_requests.js";

let filters = {status: "pending"};

fetchRequests(filters);

const sortField = document.getElementById("sort");
const statusField = document.getElementById("status");

const requestsTable = document.querySelector("#requests_table tbody");

sortField.addEventListener("change", (e) => handleSorting(e.target.value));
statusField.addEventListener("change", (e) => updateFilters({status: e.target.value}));

function handleSorting(value) {
  let item = "";
  let type = "";
  item = value.split("_")[0];
  type = value.split("_")[1];
  updateFilters({sorting_item: item, sorting_type: type});
}


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
    <td><a href="/pages/admin/customer.html?id=${request.user_id}">${request.user_name}</a></td>
    <td class="title"><a href="/pages/admin/view_book.html?id=${request.book_id}">${request.book_name}</a></td>
    <td>${request.request_date}</td>
    <td>${request.available_copies}</td>
    <td>${request.status}</td>
    <td class="actions">
      ${request.status == "pending"?  `
        <button class="approve">&#10003;</button>
        <button class="delete" onClick="alert('Are you sure? You want to cancel.')">&times;</button>` : `<span></span>`}
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
