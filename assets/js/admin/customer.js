import { getBorrowHistory } from "/services/admin/borrow_history.js";
import { getCustomer } from "/services/admin/customers.js";

const params = new URLSearchParams(window.location.search);

const ID = params.get("customer");

await fetchCustomer();

async function fetchCustomer() {
  try {
    let response = await getCustomer(ID);
    fillCustomerInformation(response.data);
    fetchBorrowHistory();
  } catch (error) {
    console.log(error);
    window.location.assign(`./customers.html`);
  }
}

async function fetchBorrowHistory() {
  try {
    let response = await getBorrowHistory({user: ID});
    fillHistoryTable(response.data);
  } catch (error) {
    console.log(error);
  }
}

function fillCustomerInformation(customer) {
  let page = document.getElementById("customer-page");
  let container = document.createDocumentFragment();

  let informationCard = document.createElement("div");
  let statsCard = document.createElement("div");
  informationCard.classList.add("customer-card");
  informationCard.innerHTML = `
            <h3>Customer Information</h3>

            <div class="info-grid">
                <div class="info-item">
                    <span>ID</span>
                    <strong>#${customer.id}</strong>
                </div>

                <div class="info-item">
                    <span>Name</span>
                    <strong>${customer.name}</strong>
                </div>

                <div class="info-item">
                    <span>Email</span>
                    <strong>${customer.email}</strong>
                </div>
            </div>
  `;
  statsCard.classList.add("stats-grid");
  statsCard.innerHTML = `          
            <div class="stat-card">
                <p>Borrowed Books</p>
                <h2>${customer.borrowed}</h2>
            </div>

            <div class="stat-card highlight">
                <p>Currently on Loan</p>
                <h2>${customer.currently_borrowing}</h2>
            </div>
  `;
  container.appendChild(informationCard);
  container.appendChild(statsCard);

  page.append(container);
}

function fillHistoryTable(history) {
  let page = document.getElementById("customer-page");
  let container = document.createDocumentFragment();

  let table = document.createElement("table");
  table.classList.add("history-table")
  table.innerHTML = `
      <thead>
          <tr>
              <th>Title</th>
              <th>Borrowed at</th>
              <th>Returned at</th>
          </tr>
      </thead>
  `;
  let body = document.createElement("tbody");
  body.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  if (!row) return;

  if (e.target.closest("button, a")) return;

  const id = row.dataset.id;
  window.location.assign(`./view_book.html?id=${id}`);
});
  history.forEach((element) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td class="title">${element.book.title}</td>
      <td>${element.borrowed_at}</td>
      <td>${element.returned_at || "-"}</td>
    `;
    row.dataset.id = element.book.id;
    body.appendChild(row);
  });
  table.appendChild(body);

  let informationCard = document.createElement("div");
  let tableWrapper = document.createElement("div");
  informationCard.classList.add("customer-card");
  tableWrapper.classList.add("history-table-container");
  informationCard.innerHTML = `<h3>Customer Information</h3>`;
  tableWrapper.appendChild(table);
  informationCard.appendChild(tableWrapper);
  container.appendChild(informationCard);
  page.append(container);
}


