import jwt from "jsonwebtoken";
import { chatAreaTemplate } from "../../templates/chat/chat-area-template";
import { ESNMessage } from "../../types";
import { getAllMessages, postPublicMessage } from "../../api/message";
import { getUserStatusByUsername } from "../../api/user";
import Formatter from "../../util/formatter";
import StatusClassifier from "../../util/statusClassifier";
import { socket } from "../../util/socket";
import { IllegalUserActionHandler } from "../../util/illegalUserHandler";

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
  postPublicMessage(message).then((response) => {
    if (response) {
      postMessage();
    }
  });
};

const renderMessage = (message: ESNMessage): void => {
  if (
    (message.sender === currentUser.username &&
      message.sendee === contactName) ||
    (message.sendee === currentUser.username &&
      message.sender === contactName) ||
    contactName === "Lobby"
  ) {
    const messageBody = document.createElement("div");
    const messageContent = document.createElement("p");
    const messageHeader = document.createElement("div");
    const userInfoBody = document.createElement("div");
    const userAvatar = document.createElement("div");
    const userAvatarContainer = document.createElement("div");
    const currentUserAvatarContainer = document.createElement("div");
    const currentUserAvatar = document.createElement("div");
    const userNickname = document.createElement("span");
    const messageBubble = document.createElement("div");
    const messageTime = document.createElement("span");
    const currentUserMessager = currentUser.username === message.sender;
    messageBubble.className = "flex w-full";
    messageBody.className =
      "bg-black items-center rounded-lg p-4 shadow-md ml-2 mr-2 mb-4 w-full";
    messageContent.className = "ml-2 mt-2 text-white  break-normal break-all";
    messageHeader.className = "flex justify-between items-center mb-2";
    userInfoBody.className = "flex space-x-2 justify-between items-center";
    userAvatarContainer.className = "min-w-1/10 w-1/10";
    userAvatar.className = "rounded-full h-10 w-10 bg-gray-500";
    currentUserAvatarContainer.className = "min-w-1/10 w-1/10 items-center";
    currentUserAvatar.className = "rounded-full h-10 w-10 bg-gray-500";
    userNickname.className = "text-white ml-2 font-semibold";
    messageTime.className = "text-white mr-3";

    messageContent.textContent = message.content;
    userNickname.textContent = currentUserMessager ? "Me" : message.sender;
    const htmlElement = StatusClassifier.classifyStatus(message.senderStatus);
    const userStatusIcon = htmlElement[1];

    messageTime.textContent = message.time
      ? Formatter.formatDate(new Date(parseInt(message.time)))
      : "";
    userInfoBody.appendChild(userNickname);
    userInfoBody.innerHTML += userStatusIcon;
    messageHeader.appendChild(userInfoBody);
    // TODO : user Avatar
    // currentUserMessager
    //   ? currentUserAvatarContainer.appendChild(currentUserAvatar)
    //   : userAvatarContainer.appendChild(userAvatar);
    messageHeader.appendChild(messageTime);
    messageBody.appendChild(messageContent);

    messageBubble.appendChild(userAvatarContainer);
    messageBubble.appendChild(messageBody);
    messageBubble.appendChild(currentUserAvatarContainer);
    messageArea?.appendChild(messageHeader);
    messageArea?.appendChild(messageBubble);

    const scroll = messageArea || new HTMLDivElement();
    scroll.scrollTop = scroll.scrollHeight || 0;
  }
};

if (contactName === "Lobby") {
  socket.on("public message", renderMessage);
} else {
  socket.on("private message", renderMessage);
}
