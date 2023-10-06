import jwt from "jsonwebtoken";
import { chatAreaTemplate } from "../../templates/chat/chat-area-template";
import { ESNMessage } from "../../types";
import { getAllPublicMessages, postPublicMessage } from "../../api/message";
import Formatter from "../../util/formatter";
import { socket } from "../../scripts/socket";
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

const postButton = document.getElementById("post-button");
const messageArea = document.getElementById("message-area");
const messageInput = document.getElementById("message-input");

getAllPublicMessages().then((response) => {
  for (const message of response) {
    renderMessage(message);
  }
});

postButton!.onclick = () => {
  const message: ESNMessage = {
    sender: currentUser.username,
    content: (messageInput as HTMLInputElement).value,
    time: Formatter.formatDate(new Date()),
  };
  recordMessage(message);
};

const postMessage = (message: ESNMessage): void => {
  socket.emit("chat message", message);
  (messageInput as HTMLInputElement).value = "";
};

const recordMessage = (message: ESNMessage) => {
  postPublicMessage(message).then((response) => {
    if (response) {
      postMessage(message);
    }
  });
};

const renderMessage = (message: ESNMessage): void => {
  const messageBody = document.createElement("div");
  const messageContent = document.createElement("p");
  const messageHeader = document.createElement("div");
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
  userAvatarContainer.className = "min-w-1/10 w-1/10";
  userAvatar.className = "rounded-full h-10 w-10 bg-gray-500";
  currentUserAvatarContainer.className = "min-w-1/10 w-1/10 items-center";
  currentUserAvatar.className = "rounded-full h-10 w-10 bg-gray-500";
  userNickname.className = "text-white ml-2 font-semibold";
  messageTime.className = "text-white";

  messageContent.textContent = message.content;
  userNickname.textContent = currentUserMessager
    ? "Me ✅"
    : message.sender + "✅";

  messageTime.textContent = message.time || "";
  messageHeader.appendChild(userNickname);
  // TODO : user Avatar
  // currentUserMessager
  //   ? currentUserAvatarContainer.appendChild(currentUserAvatar)
  //   : userAvatarContainer.appendChild(userAvatar);
  messageHeader.appendChild(messageTime);
  messageBody.appendChild(messageHeader);
  messageBody.appendChild(messageContent);

  messageBubble.appendChild(userAvatarContainer);
  messageBubble.appendChild(messageBody);
  messageBubble.appendChild(currentUserAvatarContainer);

  messageArea?.appendChild(messageBubble);
  if (currentUserMessager) {
    const scroll = messageArea || new HTMLDivElement();
    scroll.scrollTop = scroll.scrollHeight || 0;
  }
};

socket.on("chat message", renderMessage);
