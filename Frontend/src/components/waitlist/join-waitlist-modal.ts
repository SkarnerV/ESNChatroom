import jwt from "jsonwebtoken";
import { JoinWaitlistModalTemplate } from "../../templates/foodWaitlist/join-waitlist-modal-template";
import { joinWaitlist } from "../../api/waitlist";
import { socket } from "../../util/socket";

class joinFoodWaitlist extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = JoinWaitlistModalTemplate;
  }
}

customElements.define("join-waitlist-modal", joinFoodWaitlist);
const foodInput = document.getElementById("waitlist-food-input");
const confirmButton = document.getElementById("confirm-join-button");
const cancelButton = document.getElementById("cancel-join-button");
const joinWaitlistModal = document.getElementById("join-waitlist-modal");
const currentUser = jwt.decode(localStorage.getItem("token"), "esn");

cancelButton!.onclick = () => {
  if (joinWaitlistModal) {
    (foodInput as HTMLInputElement).value = "";
    joinWaitlistModal!.style.display = "none";
  }
};

confirmButton!.onclick = async () => {
  const foodComments = (foodInput as HTMLInputElement).value;
  if (foodComments == "") {
    showError("Please leave a comment!");
  } else {
    const user = await joinWaitlist(currentUser.username, foodComments);
  }
  (foodInput as HTMLInputElement).value = "";
  joinWaitlistModal!.style.display = "none";
};

const showError = (errorMessage: string) => {
  // remove all error labels
  const errorLabels = document.querySelectorAll(".error-label");
  errorLabels.forEach((label) => label.remove());

  // append error label
  const foodInput = document.getElementById("waitlist-food-input-container");
  const errorElement = document.createElement("p");
  errorElement.classList.add("error-label");
  errorElement.classList.add("text-white");
  errorElement.textContent = errorMessage;
  foodInput!.insertAdjacentElement("afterend", errorElement);
};
