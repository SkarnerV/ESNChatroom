import { updateLastStatus } from "../../api/user";
import { bannerTemplate } from "../../templates/banner/banner-template";
import jwt from "jsonwebtoken";
import {
  iconRED,
  iconGREEN,
  iconUNDEFINE,
  iconYELLOW,
} from "../../constant/svg-icon";

class Banner extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = bannerTemplate;
  }
}

customElements.define("esn-banner", Banner);

// Data for generating the list dynamically
const statusOptions = [
  { value: "GREEN", label: iconGREEN },
  { value: "YELLOW", label: iconYELLOW },
  { value: "RED", label: iconRED },
  { value: "UNDEFINE", label: iconUNDEFINE },
];

// Get the parent element where you want to append the list
const parentElement = document.getElementById("status-dropdown");

// Create the list dynamically
statusOptions.forEach((option) => {
  const li = document.createElement("li");
  li.innerHTML = `<li>
          <label class="space-x-2 flex items-center p-2 hover:bg-gray-300">
            <input
              id="status-${option.value}"
              type="radio"
              value=${option.value}
              name="status"
              class="w-8 h-8 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <label for="status-${option.value}" class="w-full ml-2">${option.label}</label>
          </label>
        </li>`;
  parentElement!.appendChild(li);
});

const speedTestButton = document.getElementById("speedtest-directory");
const logoutButton = document.getElementById("quit-directory");
const currentUser = jwt.decode(localStorage.getItem("token"), "esn");
const statusButton = document.getElementById("change-status");
const dropdownMenu = document.getElementById("status-dropdown");

speedTestButton!.onclick = () => {
  window.location.href = "/ESNSpeedTest.html";
};

logoutButton!.onclick = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

statusButton!.onclick = () => {
  if (
    dropdownMenu?.classList.contains("hidden") &&
    statusButton!.classList.contains("rounded-b")
  ) {
    statusButton!.classList.remove("rounded-b");
    dropdownMenu.classList.remove("hidden");
  } else {
    dropdownMenu?.classList.add("hidden");
    statusButton!.classList.add("rounded-b");
  }
};

document.addEventListener("click", (event) => {
  if (
    event.target !== statusButton &&
    !statusButton?.contains(event.target as Node)
  ) {
    dropdownMenu?.classList.add("hidden");
    statusButton?.classList.add("rounded-b");
  }
});

const radios = document.querySelectorAll('input[type="radio"][name="status"]');
radios.forEach((radio) => {
  radio.addEventListener("change", async function () {
    if (this.checked) {
      await updateLastStatus(currentUser.username, this.value);
    }
  });
});
