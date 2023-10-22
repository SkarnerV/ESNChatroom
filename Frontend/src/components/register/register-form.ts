import { userLogin } from "../../api/user";
import reservedUsernames from "../../constants/reserved-names";
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
  console.log("login");
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
      (document.getElementById("password") as HTMLInputElement).value =
        password;
    }
  );
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

async function handleLoginRequest(response, username: string) {
  // if the user is already a community member, the system displays the ESN Directory
  if (response.status === 200) {
    localStorage.setItem("token", response.token);
    let unreadUsers: Set<string> = new Set();

    await getUnreadMessages(username.toLowerCase()).then(
      (data: ESNMessage[]) => {
        for (const message of data) {
          unreadUsers.add(message.sender);
        }
      }
    );

    localStorage.setItem(
      "unreadUsers",
      JSON.stringify(Array.from(unreadUsers))
    );
    window.location.href = "/home.html";
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
