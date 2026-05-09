import { getCustomers, getCustomersStats } from "/services/admin/customers.js";

fetchCustomers({});
fetchCustomersStats();

let filters = {};

const searchField = document.getElementById("search");

const customersTableBody = document.querySelector("#customers_table tbody");
searchField.addEventListener("input", debounce(handleSearch, 300));

function handleSearch() {
  let query = searchField.value.trim();
  if (query.length > 0) {
    filters = { ...filters, query: query };
    fetchCustomers(filters);
  } else {
    fetchCustomers();
  }
}

async function fetchCustomers(params = {}) {
  try {
    let response = await getCustomers(params);
    fillCustomersTable(response.data);
  } catch (error) {
    console.log(error);
  }
}

async function fetchCustomersStats() {
  try {
    let response = await getCustomersStats();
    fillCustomersStats(response.data);
  } catch (error) {
    console.log(error);
  }
}

function fillCustomersTable(customers) {
  if (!customers.length) {
    customersTableBody.innerHTML = `<tr><td class="empty" colspan="5">No customers found.</td></tr>`;
    return;
  }
  let body = document.createDocumentFragment();
  customers.forEach((customer) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${customer.name}</td>
        <td>${customer.email}</td>
        <td>${customer.currently_borrowing}</td>
        <td>${customer.borrowed}</td>
        <td><a href="customer.html?customer=${customer.id}">Show</a></td>
  `;

    body.appendChild(row);
  });
  customersTableBody.innerHTML = "";
  customersTableBody.appendChild(body);
}

function fillCustomersStats(stats) {
  let totalCustomersCard = document.getElementById("total");
  totalCustomersCard.querySelector(".value").innerHTML = stats.total_customers;
}

function debounce(callback, delay) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

function clearFilters() {
  console.log("Clearing");
  fetchCustomers({});
  // searchField.
}
