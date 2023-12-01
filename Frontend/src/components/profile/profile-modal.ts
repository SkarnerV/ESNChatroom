import jwt from "jsonwebtoken";
import { ProfileModalTemplate } from "../../templates/profile/profile-modal-template";
import { IllegalUserActionHandler } from "../../util/illegalUserHandler";
import reservedUsernames from "../../constant/reserved-names";
import { getAllUserStatus } from "../../api/user";
import { ESNUserUpdateProfile } from "../../types";

class ProfileModal extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = ProfileModalTemplate;
  }
}
customElements.define("profile-modal", ProfileModal);
IllegalUserActionHandler.redirectToLogin();

const accoutOption = [{ value: "Active" }, { value: "Inactive" }];

const privilegeOption = [
  { value: "Administrator" },
  { value: "Coordinator" },
  { value: "Citizen" },
  ,
];

const accountParrent = document.getElementById("account-dropdown");
const privilegeParrent = document.getElementById("privilege-dropdown");

accoutOption.forEach((option) => {
  const li = document.createElement("li");
  li.innerHTML = `<li class="privilege-option bg-white px-4 py-2 hover:bg-gray-200 cursor-pointer w-full">
    <label class="space-x-2 flex items-center p-2 hover:bg-gray-300">
    <input
      id="status-${option!.value}"
      type="radio"
      value=${option!.value}
      name="account"
      class="w-8 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
    ${option!.value}
    </label>
    </li>`;
  accountParrent!.appendChild(li);
});

privilegeOption.forEach((option) => {
  const li = document.createElement("li");
  li.innerHTML = `<li class="privilege-option bg-white px-4 py-2 hover:bg-gray-200 cursor-pointer">
  <label class="space-x-2 flex items-center p-2 hover:bg-gray-300">
  <input
    id="status-${option!.value}"
    type="radio"
    value=${option!.value}
    name="privilege"
    class="w-8 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
  ${option!.value}
  </label>
  </li>`;
  privilegeParrent!.appendChild(li);
});

const currentUser = jwt.decode(localStorage.getItem("token"), "esn");
const profileModal = document.getElementById("profile-modal");
const closeButton = document.getElementById("profile-close-button");
const privilegeButton = document.getElementById("privilege-button");
const privilegeOptionList = document.getElementById("privilege-dropdown");
const accountButton = document.getElementById("account-button");
const accountOptionList = document.getElementById("account-dropdown");
const usernameInput = document.getElementById(
  "username-input"
) as HTMLInputElement;
const passwordInput = document.getElementById(
  "password-input"
) as HTMLInputElement;
const usernamevalidationMsg = document.createElement("div");
usernamevalidationMsg.className = "text-red-500 text-sm mt-1";
const passwordvalidationMsg = document.createElement("div");
passwordvalidationMsg.className = "text-red-500 text-sm mt-1";
const togglePasswordBtn = document.getElementById("toggle-password-btn");
const currentAccountStatus = document.getElementById("account-status");
const currentPrivilegeLevel = document.getElementById("privilege-level");
const submitButton = document.getElementById(
  "save-changes-button"
) as HTMLButtonElement;

closeButton!.onclick = () => {
  profileModal!.style.display = "none";
  usernamevalidationMsg!.textContent = "";
  passwordvalidationMsg!.textContent = "";
  passwordInput.value = "";
  passwordInput.placeholder = "***********";
  passwordInput.classList.add("hidden");
  togglePasswordBtn!.textContent = "Edit";
  submitButton.disabled = false;
  submitButton.classList.remove("bg-gray-300", "cursor-not-allowed");
  submitButton.classList.add("bg-blue-500", "hover:bg-blue-700");
};

togglePasswordBtn!.onclick = () => {
  if (passwordInput.classList.contains("hidden")) {
    passwordInput.classList.remove("hidden");
    togglePasswordBtn!.textContent = "Cancel";
    // when elect to change password, disable submit button until password is entered
    submitButton.disabled = true;
    submitButton.classList.add("bg-gray-300", "cursor-not-allowed");
    submitButton.classList.remove("bg-blue-500", "hover:bg-blue-700");
  } else {
    passwordInput.value = "";
    passwordInput.placeholder = "***********";
    passwordInput.classList.add("hidden");
    togglePasswordBtn!.textContent = "Edit";
    submitButton.disabled = false;
    submitButton.classList.remove("bg-gray-300", "cursor-not-allowed");
    submitButton.classList.add("bg-blue-500", "hover:bg-blue-700");
  }
};

submitButton!.onclick = () => {
  const updatedUser: ESNUserUpdateProfile = {
    username: usernameInput!.value,
    password: passwordInput!.value,
    account_status: currentAccountStatus!.textContent!,
    privilege_level: currentPrivilegeLevel!.textContent!,
  };
  // For displaying sample result
  console.log(updatedUser);

  profileModal!.style.display = "none";
  usernamevalidationMsg!.textContent = "";
  passwordvalidationMsg!.textContent = "";
  passwordInput.value = "";
  passwordInput.placeholder = "***********";
  passwordInput.classList.add("hidden");
  togglePasswordBtn!.textContent = "Edit";
  submitButton.disabled = false;
  submitButton.classList.remove("bg-gray-300", "cursor-not-allowed");
  submitButton.classList.add("bg-blue-500", "hover:bg-blue-700");
};

privilegeButton!.onclick = () => {
  if (
    privilegeOptionList?.classList.contains("hidden") &&
    privilegeButton!.classList.contains("rounded")
  ) {
    const radios = document.querySelectorAll(
      'input[type="radio"][name="privilege"]'
    );
    radios.forEach((radio) => {
      const inputRadio = radio as HTMLInputElement;
      if (inputRadio.value === currentPrivilegeLevel!.textContent) {
        inputRadio.checked = true;
      }
    });
    privilegeButton!.classList.remove("rounded");
    privilegeOptionList?.classList.remove("hidden");
  } else {
    privilegeOptionList?.classList.add("hidden");
    privilegeButton!.classList.add("rounded");
  }
};

accountButton!.onclick = () => {
  if (
    accountOptionList?.classList.contains("hidden") &&
    accountButton!.classList.contains("rounded")
  ) {
    const radios = document.querySelectorAll(
      'input[type="radio"][name="account"]'
    );
    radios.forEach((radio) => {
      const inputRadio = radio as HTMLInputElement;
      if (inputRadio.value === currentAccountStatus!.textContent) {
        inputRadio.checked = true;
      }
    });
    accountButton!.classList.remove("rounded");
    accountOptionList?.classList.remove("hidden");
  } else {
    accountOptionList?.classList.add("hidden");
    accountButton!.classList.add("rounded");
  }
};
document.addEventListener("click", (event) => {
  if (
    event.target !== privilegeButton &&
    !privilegeButton?.contains(event.target as Node)
  ) {
    privilegeOptionList?.classList.add("hidden");
    privilegeButton?.classList.add("rounded");
  }
  if (
    event.target !== accountButton &&
    !accountButton?.contains(event.target as Node)
  ) {
    accountOptionList?.classList.add("hidden");
    accountButton?.classList.add("rounded");
  }
});

const radios = document.querySelectorAll(
  'input[type="radio"][name="privilege"], input[type="radio"][name="account"]'
);
radios.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.checked) {
      const targetId =
        this.name === "privilege" ? "privilege-level" : "account-status";
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.textContent = this.value;
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  usernameInput!.parentNode!.insertBefore(
    usernamevalidationMsg,
    usernameInput!.nextSibling
  );

  passwordInput!.parentNode!.insertBefore(
    passwordvalidationMsg,
    passwordInput!.nextSibling
  );

  function updateSubmitButtonState() {
    const hasError =
      usernamevalidationMsg.textContent !== "" ||
      passwordvalidationMsg.textContent !== "";
    submitButton.disabled = hasError;
    if (hasError) {
      submitButton.classList.add("bg-gray-300", "cursor-not-allowed");
      submitButton.classList.remove("bg-blue-500", "hover:bg-blue-700");
    } else {
      submitButton.classList.remove("bg-gray-300", "cursor-not-allowed");
      submitButton.classList.add("bg-blue-500", "hover:bg-blue-700");
    }
  }

  const allUsernames: string[] = [];
  const getAllUsername = async () => {
    getAllUserStatus().then((response) => {
      for (const userInfo of response) {
        if (userInfo.username !== currentUser.username) {
          allUsernames.push(userInfo.username);
        }
      }
    });
  };

  function validateUsername(value) {
    getAllUsername();
    if (!value) {
      return "Username cannot be empty.";
    } else if (value.length < 3) {
      return "Username must be at least 3 characters long.";
    } else if (reservedUsernames.includes(value)) {
      return "Username is not allowed.";
    } else if (allUsernames.includes(value)) {
      return "Username is already used.";
    }
    return "";
  }

  usernameInput!.addEventListener("input", function () {
    const errorMessage = validateUsername(this.value);
    usernamevalidationMsg.textContent = errorMessage;
    updateSubmitButtonState();
  });

  function validatePassword(value) {
    if (!value) {
      return "Password cannot be empty.";
    } else if (value.length < 4) {
      return "Password must be at least 4 characters long.";
    }
    return "";
  }

  passwordInput!.addEventListener("input", function () {
    const errorMessage = validatePassword(this.value);
    passwordvalidationMsg.textContent = errorMessage;
    updateSubmitButtonState();
  });
});
