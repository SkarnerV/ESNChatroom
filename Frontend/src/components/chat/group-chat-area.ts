import jwt from "jsonwebtoken";
import { groupChatAreaTemplate } from "../../templates/chat/group-chat-area-template";
import { ESNMessage } from "../../types";
import { getAllMessages, postESNMessage } from "../../api/message";
import { getUserStatusByUsername } from "../../api/user";
import { updateGroup, deleteGroup } from "../../api/group";
import { socket } from "../../util/socket";
import { IllegalUserActionHandler } from "../../util/illegalUserHandler";
import { generateMessage } from "../../util/render";

class GroupChatArea extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = groupChatAreaTemplate;
  }
}

customElements.define("group-chat-area", GroupChatArea);
IllegalUserActionHandler.redirectToLogin();
const currentUser = jwt.decode(localStorage.getItem("token"), "esn");

let currentUserStatus = "";
const url = new URL(window.location.href);
const postButton = document.getElementById("post-button");
const messageArea = document.getElementById("message-area");
const messageInput = document.getElementById("message-input");

const displayedContact = document.getElementById("contact-name");
const contactName = url.searchParams.get("contact");

const settingsButton = document.getElementById("settings-button");
const leaveGroupButton = document.getElementById("leave-group-chat-button");

leaveGroupButton!.onclick = async () => {
  window.location.href = "/group";
};

displayedContact!.textContent = contactName;

const cancelSettingsButton = document.getElementById("cancel-settings");
const settingsModal = document.getElementById("group-settings-modal");

settingsButton!.onclick = () => {
  const temp = contactName?.split(":");
  const groupCreator = localStorage.getItem(`${temp![1]} Creator`);
  if (groupCreator === currentUser.username)
    settingsModal!.classList.remove("hidden");
};

cancelSettingsButton!.onclick = () => {
  settingsModal!.classList.add("hidden");
};

const updateGroupButton = document.getElementById("update-group");
const deleteGroupButton = document.getElementById("delete-group");

updateGroupButton!.onclick = async () => {
  const updatedName = document.getElementById(
    "update-group-name"
  ) as HTMLInputElement;
  const updatedDescription = document.getElementById(
    "update-group-description"
  ) as HTMLInputElement;

  if (updatedName && updatedDescription) {
    const name = updatedName.value;
    const description = updatedDescription.value;

    // Call API to update group
    const temp = contactName!.split(":");
    const groups = await updateGroup(temp[1], name, description);
    if (groups === null) {
      showError("Group name was taken!");
    } else {
      settingsModal!.classList.add("hidden");
      displayedContact!.textContent = "Group:" + groups.name; // Update the header
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("contact", "Group:" + groups.name);
      window.history.pushState({}, "", decodeURIComponent(newUrl.toString()));

      localStorage.removeItem(`${temp[1]} Creator`);
      localStorage.setItem(`${groups.name} Creator`, currentUser.username);
    }
  }
};

deleteGroupButton!.onclick = async () => {
  // Call API to delete group
  const temp = contactName!.split(":");
  const groups = await deleteGroup(temp[1]!);

  settingsModal!.classList.add("hidden");
  localStorage.removeItem(`${temp[1]} Creator`);
  // TODO: Redirect or update UI as necessary
  window.location.href = "/group";
};

getUserStatusByUsername(currentUser.username).then((response) => {
  currentUserStatus = response.lastStatus;
});

if (contactName) {
  getAllMessages(currentUser.username, contactName).then((response) => {
    for (const message of response) {
      renderMessage(message);
    }
  });

  postButton!.onclick = () => {
    const message: ESNMessage = {
      sender: currentUser.username,
      sendee: contactName,
      content: (messageInput as HTMLInputElement).value,
      senderStatus: currentUserStatus,
    };

    recordMessage(message);
  };
} else {
  alert("illegal action");
  window.location.href = "/group.html";
}

const postMessage = (): void => {
  (messageInput as HTMLInputElement).value = "";
};

const recordMessage = (message: ESNMessage) => {
  postESNMessage(message).then((response) => {
    if (response) {
      postMessage();
    }
  });
};

const isCorrectReceiver = (message: ESNMessage) => {
  return (
    (message.sender === currentUser.username &&
      message.sendee === contactName) ||
    (message.sendee === currentUser.username &&
      message.sender === contactName) ||
    contactName?.startsWith("Group")
  );
};
function showError(errorMessage: string) {
  // remove all error labels
  const errorLabels = document.querySelectorAll(".error-label");
  errorLabels.forEach((label) => label.remove());

  // append error label
  const errorElement = document.createElement("p");
  errorElement.classList.add("error-label");
  errorElement.classList.add("text-red-500");
  errorElement.textContent = errorMessage;
  deleteGroupButton!.insertAdjacentElement("afterend", errorElement);
}

const renderMessage = (message: ESNMessage): void => {
  if (isCorrectReceiver(message)) {
    const renderedElements = generateMessage(message);
    const messageHeader = renderedElements[0];
    const messageBubble = renderedElements[1];
    messageArea?.appendChild(messageHeader);
    messageArea?.appendChild(messageBubble);
    const scroll = messageArea || new HTMLDivElement();
    scroll.scrollTop = scroll.scrollHeight || 0;
  }
};

socket.on(
  contactName?.startsWith("Group") === true ? contactName : "private message",
  renderMessage
);
