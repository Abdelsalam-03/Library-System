import { getUser } from "/services/auth.js";

await fetchUser();

async function fetchUser() {
  try {
    const user = await getUser();
    if (!user.is_admin) {
      window.location.assign("/pages/index.html");
    }
  } catch (error) {
    console.log("Unauthenticated");
    window.location.assign("/index.html");
  }
}
