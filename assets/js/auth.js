import { login, signup, logout, getMe } from "/services/auth.js";
import { parseErrors } from "/utils/api.js"
var loginForm = document.getElementById("login_form");
var signupForm = document.getElementById("signup_form");

if (loginForm != null) {
  loginForm.addEventListener("submit", handleLogin);
}

if (signupForm != null) {
  signupForm.addEventListener("submit", handleSignup);
}

async function handleLogin(event) {
  event.preventDefault();
  resetLoginErrors();
  let emailField = document.getElementById("email");
  let passwordField = document.getElementById("password");
  let email = emailField.value.trim();
  let password = passwordField.value.trim();
  let hasError = false;

  if (!isValidEmail(email)) {
    hasError = true;
    let errorLabel = document.createElement("p");
    errorLabel.innerHTML = "Invalid email, expected: example@gmail.com";
    errorLabel.classList.add("error");
    emailField.classList.add("warning");
    emailField.parentNode.appendChild(errorLabel);
  }

  if (password.length < 8) {
    hasError = true;
    let errorLabel = document.createElement("p");
    errorLabel.innerHTML = "Password must be > 7 characters";
    errorLabel.classList.add("error");
    passwordField.classList.add("warning");
    passwordField.parentNode.appendChild(errorLabel);
  }

  if (!hasError) {
      let {data, success, errors} = await login({ email: email, password: password });
    
      if(!success){
          const errorMessages = parseErrors(errors);
          let errorLabel = document.createElement("p");
          errorLabel.id = "main_error";
          errorLabel.innerHTML = errorMessages[0];
          errorLabel.classList.add("error");
          let parent = loginForm.parentNode;
          parent.insertBefore(errorLabel, loginForm);
      }else{
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
  
        const user = await getMe();
        if (user.role == "ADMIN") {
          window.location.assign("/pages/admin/index.html");
        } else {
          window.location.assign("/pages/index.html");
        }
      }
  }
}

async function handleSignup(event) {
  event.preventDefault();
  resetSignupErrors();
  let nameField = document.getElementById("username");
  let emailField = document.getElementById("email");
  let passwordField = document.getElementById("password");
  let passwordConfirmField = document.getElementById("confirm_password");
  let isAdminField = document.getElementById("isadmin");
  let name = nameField.value.trim();
  let email = emailField.value.trim();
  let password = passwordField.value.trim();
  let passwordConfirmation = passwordConfirmField.value.trim();
  let hasError = false;

  if (name.length < 3) {
    hasError = true;
    let errorLabel = document.createElement("p");
    errorLabel.innerHTML = "Invalid name, at least 3 characters";
    errorLabel.classList.add("error");
    nameField.classList.add("warning");
    nameField.parentNode.appendChild(errorLabel);
  }

  if (!isValidEmail(email)) {
    hasError = true;
    let errorLabel = document.createElement("p");
    errorLabel.innerHTML = "Invalid email, expected: example@gmail.com";
    errorLabel.classList.add("error");
    emailField.classList.add("warning");
    emailField.parentNode.appendChild(errorLabel);
  }

  if (password.length < 8) {
    hasError = true;
    let errorLabel = document.createElement("p");
    errorLabel.innerHTML = "Password must be > 7 characters";
    errorLabel.classList.add("error");
    passwordField.classList.add("warning");
    passwordField.parentNode.appendChild(errorLabel);
  } else {
    if (passwordConfirmation != password) {
      hasError = true;
      let errorLabel = document.createElement("p");
      errorLabel.innerHTML = "Password missmatch";
      errorLabel.classList.add("error");
      passwordConfirmField.classList.add("warning");
      passwordConfirmField.parentNode.appendChild(errorLabel);
    }
  }

  if (!hasError) {
      let registerData = {
        email: email,
        username: email,
        first_name: name.split(' ')[0],
        last_name: name.split(' ')[0],
        password: password,
        role: isAdminField.checked? "ADMIN" : "USER",
      };

      let {success, errors} = await signup(registerData);
      
      if(!success){
        console.log(errors)
        const errorMessages = parseErrors(errors);
        let errorLabel = document.createElement("p");
        errorLabel.id = "main_error";
        errorLabel.innerHTML = errorMessages[0];
        errorLabel.classList.add("error");
        let parent = signupForm.parentNode;
        parent.insertBefore(errorLabel, signupForm);
      }else{
        alert("Registered Successfully, you can now log in!");
        window.location.assign("/pages/auth/login.html");
      }
  }
}

function resetLoginErrors() {
  let emailField = document.getElementById("email");
  emailField.classList.remove("warning");
  emailField.nextSibling?.remove();
  let passwordField = document.getElementById("password");
  passwordField.classList.remove("warning");
  passwordField.nextSibling?.remove();
  document.getElementById("main_error")?.remove();
}

function resetSignupErrors() {
  let nameField = document.getElementById("username");
  nameField.classList.remove("warning");
  nameField.nextSibling?.remove();
  let emailField = document.getElementById("email");
  emailField.classList.remove("warning");
  emailField.nextSibling?.remove();
  let passwordField = document.getElementById("password");
  passwordField.classList.remove("warning");
  passwordField.nextSibling?.remove();
  let passwordConfirmation = document.getElementById("confirm_password");
  passwordConfirmation.classList.remove("warning");
  passwordConfirmation.nextSibling?.remove();
  document.getElementById("main_error")?.remove();
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}


window.logout = async function(){
  await logout();
}