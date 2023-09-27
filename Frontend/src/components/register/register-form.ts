import { userLogin } from "../../api/user";
import reservedUsernames from "../../constants/reserved-names";
import { registerFormTemplate } from "../../templates/register-form-template";
import CryptoJS from "crypto-js";
class RegisterForm extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = registerFormTemplate;
  }
}

customElements.define("register-form", RegisterForm);

const modal = document.getElementById("welcome-modal");

const joinButton = document.getElementById("join-button");

joinButton!.onclick = async () => {
  showError("");
  const username =
    (document.getElementById("username") as HTMLInputElement).value || "";
  const password =
    (document.getElementById("password") as HTMLInputElement).value || "";

  if (!isUsernameValid(username)) return;
  if (!isPasswordValid(password)) return;

  const hashedPassword = CryptoJS.MD5(password).toString();

  await userLogin(username.toLowerCase(), hashedPassword).then((response) => {
    handleLoginRequest(response);
    (document.getElementById("password") as HTMLInputElement).value =
      hashedPassword;
  });
};

function showError(errorMessage: string) {
  // remove all error labels
  const errorLabels = document.querySelectorAll(".error-label");
  errorLabels.forEach((label) => label.remove());

  // append error label
  const passwordInput = document.getElementById("password");
  const errorElement = document.createElement("p");
  errorElement.classList.add("error-label");
  errorElement.classList.add("text-red-500");
  errorElement.textContent = errorMessage;
  passwordInput!.insertAdjacentElement("afterend", errorElement);
}

function isUsernameValid(username: string) {
  username = username.toLowerCase();
  if (username.length < 3) {
    showError("Username must be at least 3 characters long.");
    return false;
  }
  if (reservedUsernames.includes(username)) {
    showError("Username is not allowed.");
    return false;
  }
  return true;
}

function isPasswordValid(password: string) {
  if (password.length < 4) {
    showError("Password must be at least 4 characters long.");
    return false;
  }
  return true;
}

function handleLoginRequest(response) {
  // Iteration0-A1: if the user is already a community member
  // (the username already exists and the password is correct), then nothing happens
  if (response.status === 200) {
    // remove any error message
    showError("");
    localStorage.setItem("token", response.token);
    return;
  }
  // if the username already exists but the password is incorrect (does not match the existing username),
  // the system informs the Citizen that he needs to re-enter the username and/or password.
  else if (response.status === 401) {
    showError(response.message);
    return;
  }
  // user does not exist, show confirmation modal for user to start registration
  else {
    modal!.style.display = "block";
  }
}
