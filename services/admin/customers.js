export async function getCustomers(params = {}) {
  try {
    const response = await fetch("/data/users.json");
    let data = await response.json();
    data = data.filter((user) => !user.is_admin);
    if (params.query != undefined) {
      data = data.filter((user) => {
        return (
          matchValue(user.name, params.query) ||
          matchValue(user.email, params.query)
        );
      });
    }

    let historyRequest = await fetch("/data/borrow_history.json");
    let history = await historyRequest.json();
    let historyData = {};
    history.forEach((element) => {
      if (historyData[element.user.id] == undefined) {
        historyData[element.user.id] = {
          borrowed: 1,
          currently_borrowing: element.returned_at == null ? 1 : 0,
        };
      } else {
        let currently = historyData[element.user.id].currently_borrowing;
        ++historyData[element.user.id].borrowed;
        historyData[element.user.id].currently_borrowing =
          element.returned_at == null ? currently + 1 : currently;
      }
    });
    data = data.map((item) => ({
      ...item,
      borrowed: historyData[item.id]?.borrowed || 0,
      currently_borrowing: historyData[item.id]?.currently_borrowing || 0
    }));
    return { data: data };
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

export async function getCustomer(id) {
  try {
    const response = await fetch("/data/users.json");
    const data = await response.json();
    let found = false;
    let customer = {};
    data.forEach((element) => {
      if (element.id == id) {
        found = true;
        customer = element;
        return;
      }
    });
    if (found) {
      return { data: customer };
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

export async function getCustomersStats() {
  try {
    const response = await fetch("/data/users.json");
    const data = await response.json();
    let total = 0;
    data.forEach((element) => {
      if (!element.is_admin) {
        ++total;
      }
    });
    return {
      data: {
        total_customers: total,
      },
    };
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

function matchValue(text, value) {
  const regex = new RegExp(value, "i");
  return regex.test(text);
}
