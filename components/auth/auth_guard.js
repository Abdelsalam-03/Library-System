import { getUser } from "/services/auth.js";

await fetchUser();


async function fetchUser() {
  try {
    const user = await getUser();
    } catch (error) {
        console.log("unauthenticated");
        window.location.assign("/index.html");
  }
}
