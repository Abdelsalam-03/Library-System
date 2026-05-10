import { customFetch } from "/utils/api.js";

async function getUsers() {
  try {
    const response = await fetch("/data/users.json");
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

export async function getMe() {
  const res = await customFetch('/api/auth/me/', {
        method: 'GET',
    });

    const {data: user} = await res.json();

    return user;
}

export async function login({email, password}) {
  const res = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: password })
    })

    const data = await res.json();

    return data;
}

export async function logout(){
  const refreshToken = localStorage.getItem("refresh");

  const res = await customFetch('/api/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken })
    });

    const result = await res.json();

    if(result.success){
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }else{
      localStorage.clear();
      window.location.assign("/pages/auth/login.html");
    }

    return result.success;
}

export async function signup(registerData) {
  const res = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
    })

    const data = await res.json();

    return data;
}

export async function getUser() {
  let loggedUser = localStorage.getItem("user");
  if (loggedUser == undefined) {
    throw {
      message: "No logged in user",
      status: 401,
    };
  }
  return JSON.parse(loggedUser);
}

export async function destroySession() {
  localStorage.removeItem("user");
}
