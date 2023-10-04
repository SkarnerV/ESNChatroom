import { userRegister } from "../../api/user";
import { registerModalTemplate } from "../../templates/register/register-modal-template";
import CryptoJS from "crypto-js";
class RegisterModal extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = registerModalTemplate;
  }
}

const modal = document.getElementById("welcome-modal");
customElements.define("register-modal", RegisterModal);
const cancelButton = document.getElementById("modal-cancel");
const confirmButton = document.getElementById("modal-confirm");

cancelButton!.onclick = async () => {
  modal!.style.display = "none";
};

confirmButton!.onclick = async () => {
  const username =
    (document.getElementById("username") as HTMLInputElement).value || "";
  const password =
    (document.getElementById("password") as HTMLInputElement).value || "";
  const hashedPassword = CryptoJS.MD5(password).toString();

  await userRegister(username.toLowerCase(), hashedPassword)
    .then((data) => {
      if (data.status === 201) {
        // if user successfully created, show welcome modal
        showWelcomeModal();
        localStorage.setItem("token", data.token);
      } else if (data.status === 400) {
        alert(data.message);
        return;
      }
    })
    .catch((error) => {
      // Handle error during the API call
      alert(error);
    });
};

function showWelcomeModal() {
  const modalBody = document.getElementById("modal-body");
  const continueButton = document.getElementById("modal-continue");
  const confirmMessage = document.getElementById("confirm-message");
  modalBody!.style.display = "block";
  confirmButton!.style.display = "none";
  continueButton!.style.display = "block";
  cancelButton!.style.display = "none";
  confirmMessage!.style.display = "none";
  continueButton!.onclick = async () => redirectToHomePage();
}

function redirectToHomePage() {
  window.location.href = "/home";
}
