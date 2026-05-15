import { customFetch } from "/utils/api.js";

export async function getDashboard() {
  try {
    let url = `/api/admin/dashboard/`;
    
    const response = await customFetch(url , {
      method: "GET",
    });
    let { data } = await response.json();
    return { data: data };
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}