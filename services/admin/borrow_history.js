export async function getBorrowHistory(params = {}) {
  try {
    const response = await fetch("/data/borrow_history.json");
    let data = await response.json();
    // if (params.sorting_type != undefined) {
    //   if (params.sorting_type == "asc") {
    //     data = data.reverse();
    //   }
    // }
    // if (params.status != undefined && params.status != "all") {
    //   data = data.filter((item) => {
    //     return item.status == params.status;
    //   });
    // }
    if (params.user != undefined) {
      data = data.filter((item) => {
        return item.user.id == params.user;
      });
    }
    return { data: data };
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}
