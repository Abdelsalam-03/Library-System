import { getUser } from "/services/auth.js";

await fetchUser();


async function fetchUser() {
  try {
    const user = await getUser();
    console.log(user);
        if (!user.is_admin) {
            window.location.assign("/pages/index.html");
        }
    } catch (error) {
        console.log("unauthorized");
        window.location.assign("/index.html");
  }
}
