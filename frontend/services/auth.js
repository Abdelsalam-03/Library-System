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

export async function login(data) {
  let users = await getUsers();
  let found = false;
  let authenticatedUser = {};
  users.forEach((user) => {
    if (user.email == data.email) {
      if (user.password == data.password) {
        found = true;
        authenticatedUser = user;
        return;
      } else {
        return;
      }
    }
  });
  if (found) {
    return { data: authenticatedUser };
  } else {
    throw {
      message: "Wrong Credentials",
      status: 400,
    };
  }
}

export async function signup(data) {
  const { name, password, email, password_confirmation, is_admin } = data;
  let users = await getUsers();
  let found = false;
  let authenticatedUser = {};
  users.forEach((user) => {
    if (user.email == email) {
      found = true;
      return;
    }
  });

  if (found) {
    throw {
      message: "User is already exists",
      status: 400,
    };
  } else {
    authenticatedUser = {
      id: 5,
      name: name,
      email: email,
      is_admin: is_admin,
    };
    return { data: authenticatedUser };
  }
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
