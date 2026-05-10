import { getMe } from "/services/auth.js";

await fetchUser();


async function fetchUser() {
  const user = await getMe();
  if(!user){
    console.log("unauthenticated");
    window.location.assign("/index.html");
  }
}
