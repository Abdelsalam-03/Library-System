import { getMe } from "/services/auth.js";


export async function isAdmin(){
    const user = await getMe();

    return user.role == "ADMIN";
    
    // if (user !== null) {
    //     if (user.role !== "ADMIN") {
    //         window.location.assign("/index.html");
    //     }
    // }else {
    //     window.location.assign("/index.html");
    // }
}


