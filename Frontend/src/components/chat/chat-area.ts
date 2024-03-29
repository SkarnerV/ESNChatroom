import jwt from "jsonwebtoken";
import { chatAreaTemplate } from "../../templates/chat/chat-area-template";
import { ESNMessage } from "../../types";
import { getAllMessages, postESNMessage } from "../../api/message";
import { getUserStatusByUsername } from "../../api/user";
import Formatter from "../../util/formatter";
import { socket } from "../../util/socket";
import { IllegalUserActionHandler } from "../../util/illegalUserHandler";
import { generateMessage } from "../../util/render";
import { displaySchedules, getAllSchedules } from "../../api/schedule";

class ChatArea extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = chatAreaTemplate;
  }
}

customElements.define("chat-area", ChatArea);

IllegalUserActionHandler.redirectToLogin();
const currentUser = jwt.decode(localStorage.getItem("token"), "esn");
let currentUserStatus = "";
const url = new URL(window.location.href);
const postButton = document.getElementById("post-button");
const messageArea = document.getElementById("message-area");
const messageInput = document.getElementById("message-input");
const backButton = document.getElementById("chat-back-button");
const displayedContact = document.getElementById("contact-name");
const contactName = url.searchParams.get("contact");
const searchButton = document.getElementById("search-icon");
const scheduleButton = document.getElementById("schedule-icon");

if (contactName === "Lobby") {
  scheduleButton!.style.display = "none";
}

scheduleButton!.onclick = async () => {
  const scheduleModal = document.getElementById("schedule-modal");
  scheduleModal!.style.display = "block";
  if (contactName) {
    // Retrieve existing schedules
    getAllSchedules(currentUser.username, contactName).then((response) => {
      displaySchedules(response);
    });
  }
};

searchButton!.onclick = async () => {
  const searchModal = document.getElementById("search-modal");
  // Set a data attribute 'context' to 'messages' on the modal
  const searchContext = "messages";
  searchModal!.setAttribute("data-context", searchContext);
  searchModal!.setAttribute("data-sender", currentUser.username);
  if (contactName) searchModal!.setAttribute("data-sendee", contactName);
  searchModal!.style.display = "block";

  // Display all messages
  const resultList = document.getElementById("search-result-area");
  const clonedMessageContent = messageArea!.cloneNode(true);
  resultList!.appendChild(clonedMessageContent);
};

displayedContact!.textContent = contactName;

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
  window.location.href = "/home.html";
}

backButton!.onclick = () => {
  window.location.href = "/home.html";
};

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
    contactName === "Lobby"
  );
};

const renderMessage = (message: ESNMessage): void => {
  if (isCorrectReceiver(message)) {
    // TODO : user Avatar
    // currentUserMessager
    //   ? currentUserAvatarContainer.appendChild(currentUserAvatar)
    //   : userAvatarContainer.appendChild(userAvatar);

    const renderedElements = generateMessage(message);
    const messageHeader = renderedElements[0];
    const messageBubble = renderedElements[1];
    messageArea?.appendChild(messageHeader);
    messageArea?.appendChild(messageBubble);
    const scroll = messageArea || new HTMLDivElement();
    scroll.scrollTop = scroll.scrollHeight || 0;
  }
};

socket.on(contactName === "Lobby" ? "Lobby" : "private message", renderMessage);
