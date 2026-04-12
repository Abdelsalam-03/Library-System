import { showToast } from "/utils/toast.js";
import { getUser } from "/services/auth.js";
let user = null;

const nameField = document.getElementById("name");
const passwordField = document.getElementById("password");
const newPasswordField = document.getElementById("new_password");
const confirmPasswordField = document.getElementById("password_confirmation");

const nameForm = document.getElementById("name_form");
nameForm.querySelector("#reset_name").addEventListener("click", () => {
  fillUserInformation();
});
nameForm.addEventListener("submit", handleChangeName);

const passwordForm = document.getElementById("password_form");
passwordForm.addEventListener("submit", handleChangePassword);

await fetchUser();
async function fetchUser() {
  try {
    let response = await getUser();
    user = response;
    fillUserInformation();
  } catch (error) {
    console.log(error);
  }
}

function fillUserInformation() {
  nameField.value = user.name;
  resetNameErrors();
}

async function handleChangeName(event) {
  event.preventDefault();
  resetNameErrors();
  let name = nameField.value.trim();
  let hasError = false;

  if (name.length < 3) {
    hasError = true;
    let errorLabel = document.createElement("p");
    errorLabel.innerHTML = "Invalid name, at least 3 characters";
    errorLabel.classList.add("error");
    nameField.classList.add("warning");
    nameField.parentNode.appendChild(errorLabel);
  } else if (name == user.name) {
    hasError = true;
    let errorLabel = document.createElement("p");
    errorLabel.innerHTML = "Please enter a new name";
    errorLabel.classList.add("error");
    nameField.classList.add("warning");
    nameField.parentNode.appendChild(errorLabel);
  }

  if (!hasError) {
    try {
      console.log("Changing name");
      let data = {
        name: name,
      };
      //Send request
      showToast("Name Changed Successfully.", "success");
    } catch (error) {
      console.log("Error");
      console.log(error);
      if (error.status == 404) {
      }
    }
  }
}

async function handleChangePassword(event) {
  event.preventDefault();
  resetPasswordErrors();
  let oldPassword = passwordField.value.trim();
  let newPassword = newPasswordField.value.trim();
  let passwordConfirmation = confirmPasswordField.value.trim();
  let hasError = false;

  if (oldPassword.length < 8) {
    hasError = true;
    let errorLabel = document.createElement("p");
    errorLabel.innerHTML = "Password must be > 7 characters";
    errorLabel.classList.add("error");
    passwordField.classList.add("warning");
    passwordField.parentNode.appendChild(errorLabel);
  } else {
    if (newPassword.length < 8) {
      hasError = true;
      let errorLabel = document.createElement("p");
      errorLabel.innerHTML = "Password must be > 7 characters";
      errorLabel.classList.add("error");
      newPasswordField.classList.add("warning");
      newPasswordField.parentNode.appendChild(errorLabel);
    } else if (passwordConfirmation != newPassword) {
      hasError = true;
      let errorLabel = document.createElement("p");
      errorLabel.innerHTML = "Password missmatch";
      errorLabel.classList.add("error");
      confirmPasswordField.classList.add("warning");
      confirmPasswordField.parentNode.appendChild(errorLabel);
    }
  }

  if (!hasError) {
    try {
      console.log("Changing Password");
      let data = {
        old_password: oldPassword,
        password: newPassword,
        password_confirmation: passwordConfirmation,
      };
      // Send request
      passwordForm.reset();
      showToast("Password Changed Successfully.", "success");
    } catch (error) {
      console.log("Error");
      console.log(error);
    }
  }
}

function resetNameErrors() {
  nameField.classList.remove("warning");
  nameField.nextSibling?.remove();
}

function resetPasswordErrors() {
  passwordField.classList.remove("warning");
  passwordField.nextSibling?.remove();
  newPasswordField.classList.remove("warning");
  newPasswordField.nextSibling?.remove();
  confirmPasswordField.classList.remove("warning");
  confirmPasswordField.nextSibling?.remove();
}
