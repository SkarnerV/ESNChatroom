import { userLogin } from "../../api/user";
import reservedUsernames from "../../constant/reserved-names";
import { registerFormTemplate } from "../../templates/register/register-form-template";
import CryptoJS from "crypto-js";
import { IllegalUserActionHandler } from "../../util/illegalUserHandler";
import { getUnreadMessages } from "../../api/message";
import { ESNMessage } from "../../types";

class RegisterForm extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = registerFormTemplate;
  }
}

IllegalUserActionHandler.redirectToHome();

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

  await userLogin(username.toLowerCase(), hashedPassword).then(
    async (response) => {
      handleLoginRequest(response, username.toLowerCase());
    }
  );
};

const showError = (errorMessage: string) => {
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
};

const isUsernameValid = (username: string) => {
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
};

const isPasswordValid = (password: string) => {
  if (password.length < 4) {
    showError("Password must be at least 4 characters long.");
    return false;
  }
  return true;
};

const handleLoginRequest = async (response, username: string) => {
  // if the user is already a community member, the system displays the ESN Directory

  if (response.token) {
    localStorage.setItem("token", response.token);
    setUnreadMessageUsers(username);
    window.location.href = "/home.html";
    return;
  }
  // if the username already exists but the password is incorrect (does not match the existing username),
  // the system informs the Citizen that he needs to re-enter the username and/or password.
  else if (response.status === 401) {
    showError(response.exceptionMessage);
    return;
  }
  // user does not exist, show confirmation modal for user to start registration
  else {
    modal!.style.display = "block";
  }
};

const setUnreadMessageUsers = async (username: string) => {
  let unreadUsers: Set<string> = new Set();

  await getUnreadMessages(username.toLowerCase()).then((data: ESNMessage[]) => {
    for (const message of data) {
      unreadUsers.add(message.sender);
    }
  });

  localStorage.setItem("unreadUsers", JSON.stringify(Array.from(unreadUsers)));
};
