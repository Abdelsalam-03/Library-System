import { getMe } from "/services/auth.js";

export async function isUser(){
    const user = await getMe();

    return user.role == "USER";
}