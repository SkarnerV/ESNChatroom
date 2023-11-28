import { GroupPageTemplate } from "../../templates/group/group-page-template";
import { createGroup, getAllGroups } from "../../api/group";
import jwt from "jsonwebtoken";

class GroupPage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = GroupPageTemplate;
    this.renderGroupList();
  }

  async renderGroupList() {
    const groups = await getAllGroups();

    const availableGroupsDiv = document.getElementById("available-groups");
    availableGroupsDiv!.innerHTML = ""; // Clear existing group list

    groups.forEach((group: { name: string }) => {
      // Specify the type of 'group' to avoid the error
      updateGroupList(group);
    });
  }
}

customElements.define("group-page-area", GroupPage);
const createGroupButton = document.getElementById("create-group-btn");
const backButton = document.getElementById("back-button");
const availableGroupsDiv = document.getElementById("available-groups");
const createButton = document.getElementById("create-group");
const cancelButton = document.getElementById("cancel-modal");
const modal = document.getElementById("group-creation-modal");

createButton!.onclick = () => modal!.classList.remove("hidden");
cancelButton!.onclick = () => modal!.classList.add("hidden");

backButton!.onclick = () => {
  window.location.href = "/home.html";
};

createGroupButton!.onclick = async () => {
  const groupName =
    (document.getElementById("group-name") as HTMLInputElement).value || "";
  const groupDescription =
    (document.getElementById("group-description") as HTMLInputElement).value ||
    "";
  // Send data to backend and create group
  const createdGroup = await createGroup(groupName, groupDescription);
  if (createdGroup === null) {
    showError("Group already exists!");
  } else {
    // set the group creator
    const currentUser = jwt.decode(localStorage.getItem("token"), "esn");
    localStorage.setItem(`${createdGroup.name} Creator`, currentUser.username);
    updateGroupList(createdGroup);

    // Hide modal and clear inputs
    modal!.classList.add("hidden");
  }
};

function updateGroupList(group: { name: string }) {
  const newGroupDiv = document.createElement("div");
  newGroupDiv.className =
    "group-item bg-white flex justify-between items-center p-4 rounded shadow mb-4";
  newGroupDiv.innerHTML = `
  <span class="text-xl font-semibold text-gray-800 italic">Group Name: ${group.name}</span>
  <button class="join-button bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">CHAT</button>
`;
  availableGroupsDiv!.appendChild(newGroupDiv);
  const joinButton = newGroupDiv.querySelector(".join-button");
  joinButton!.addEventListener("click", () => {
    window.location.href = `groupChat.html?contact=Group:${group.name}`;
  });
}

function showError(errorMessage: string) {
  // remove all error labels
  const errorLabels = document.querySelectorAll(".error-label");
  errorLabels.forEach((label) => label.remove());

  // append error label
  const errorElement = document.createElement("p");
  errorElement.classList.add("error-label");
  errorElement.classList.add("text-red-500");
  errorElement.textContent = errorMessage;
  createGroupButton!.insertAdjacentElement("afterend", errorElement);
}
