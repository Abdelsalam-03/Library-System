export async function getBorrowRequests(params = {}) {
  try {
    const response = await fetch("/data/borrow_requests.json");
    let data = await response.json();
    if (params.sorting_type != undefined) {
      if (params.sorting_type == "asc") {
        data = data.reverse();
      }
    }
    if (params.status != undefined && params.status != "all") {
      data = data.filter((item) => {
        return item.status == params.status;
      });
    }
    return { data: data };
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}
