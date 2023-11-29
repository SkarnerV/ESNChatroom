import jwt from "jsonwebtoken";
import { DonateFoodModalTemplate } from "../../templates/foodWaitlist/donate-waitlist-modal-template";
import {
  updateWaitlistStatus,
  deleteCitizenFromWaitlist,
} from "../../api/waitlist";
class donateFood extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = DonateFoodModalTemplate;
  }
}

customElements.define("donate-waitlist-modal", donateFood);
const confirmButton = document.getElementById("confirm-donate-button");
const cancelButton = document.getElementById("cancel-donate-button");
const donateFoodModal = document.getElementById("donate-waitlist-modal");
const doneeUsernameText = document.getElementById("donee-username");
const currentUser = jwt.decode(localStorage.getItem("token"), "esn");
let citizenName: string = "";
let isRemoveFoodDonor: boolean = false;

document.addEventListener("citizenName", (event: Event) => {
  const customEvent = event as CustomEvent;
  citizenName = customEvent.detail.username;
  doneeUsernameText!.textContent = customEvent.detail.username;
  isRemoveFoodDonor = customEvent.detail.isRemoveFoodDonor;
});

cancelButton!.onclick = () => {
  if (donateFoodModal) {
    donateFoodModal!.style.display = "none";
  }
};

confirmButton!.onclick = async () => {
  if (isRemoveFoodDonor) {
    await deleteCitizenFromWaitlist(citizenName);
  } else {
    await updateWaitlistStatus(citizenName, currentUser.username);
  }
  donateFoodModal!.style.display = "none";
};
