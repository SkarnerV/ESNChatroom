import {
  momentTemplate,
  postTemplate,
} from "../../templates/moment/moment-template";
import jwt from "jsonwebtoken";
import { IllegalUserActionHandler } from "../../util/illegalUserHandler";
import { getUserStatusByUsername } from "../../api/user";
import { ESNMessage, Likes } from "../../types";
import { getAllMessages, postESNMessage } from "../../api/message";

import { socket } from "../../util/socket";
import Formatter from "../../util/formatter";
import { likeMessage, removeMessage } from "../../api/likes";
class Moment extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = momentTemplate;
  }
}

customElements.define("esn-moment", Moment);

IllegalUserActionHandler.redirectToLogin();
const currentUser = jwt.decode(localStorage.getItem("token"), "esn");
let currentUserStatus = "";
let allPost: Map<number, string[]> = new Map<number, string[]>();
const postButton = document.getElementById("post-button");
const messageArea = document.getElementById("post-area");
const messageInput = document.getElementById("message-input");

getUserStatusByUsername(currentUser.username).then((response) => {
  currentUserStatus = response.lastStatus;
});

const removesMessage = (message: ESNMessage): void => {
  removeMessage(message.id!.toString());
};

const deleteMessage = (message: ESNMessage): void => {
  const messageElementToRemove = document.getElementById(`post-${message.id}`);
  messageArea!.removeChild(messageElementToRemove!);
};

const renderMessage = (message: ESNMessage): void => {
  const postInfo = document.createElement("div");
  postInfo.id = `post-${message.id}`;
  postInfo.className = "bg-fuchsia-950 p-4 mb-4 mx-3 my-3 shadow-md rounded-md";
  postInfo.innerHTML = postTemplate;
  const postContent = postInfo.querySelector("#post-content");
  postContent!.textContent = message.content;
  const postAge = postInfo.querySelector("#post-age");
  postAge!.textContent = Formatter.calculateTimeAgo(message.time);

  const author = postInfo.querySelector("#post-author");
  author!.textContent =
    currentUser.username === message.sender ? "Me" : message.sender;

  const postActionsContainer = document.createElement("div");
  postActionsContainer.className = "flex justify-between text-white";

  // Create the left section with like button and likes count
  const leftSection = document.createElement("div");
  leftSection.className = "flex items-center space-x-2";

  const likeButton = document.createElement("button");
  likeButton.id = `like-button-${message.id}`;
  likeButton.className = "bg-pink-600 text-white px-4 rounded-md";

  const likedBefore = message.likes!.some(
    (l) => l.username === currentUser.username
  );
  likeButton.textContent = likedBefore ? "UndoLike" : "Like";
  likeButton.onclick = () => likesMessage(message.id!);

  const likesCount = document.createElement("div");
  likesCount.id = `like-count-${message.id}`;
  likesCount!.textContent = message.likes!.length.toString();

  // Append like button and likes count to the left section
  leftSection.appendChild(likeButton);
  leftSection.appendChild(likesCount);
  postActionsContainer.appendChild(leftSection);
  // Create the right section with delete button
  if (message.sender === currentUser.username) {
    const deleteButton = document.createElement("button");
    deleteButton.className = "bg-red-600 text-white px-4 rounded-md";
    deleteButton.textContent = "Delete";
    postActionsContainer.appendChild(deleteButton);
    deleteButton.onclick = () => removesMessage(message);
  }

  // Append left and right sections to the main container

  if (message.likes) {
    allPost[message.id!] = message.likes!.map((l) => l.username);
  }
  postInfo?.appendChild(postActionsContainer);
  messageArea?.prepend(postInfo);
};

getAllMessages(currentUser.username, "Post").then((response) => {
  // console.log(response);
  for (const message of response) {
    renderMessage(message);
  }
  console.log(allPost);
});

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

const likesMessage = (postId: number) => {
  likeMessage(postId, currentUser.username).then((response) => {
    const likeButton = document.getElementById(`like-button-${postId}`);
    const likeCount = document.getElementById(`like-count-${postId}`);

    if (likeButton!.textContent === "Like") {
      likeButton!.textContent = "UndoLike";
      likeCount!.textContent = (
        parseInt(likeCount!.textContent!) + 1
      ).toString();
    } else {
      likeButton!.textContent = "Like";
      likeCount!.textContent = (
        parseInt(likeCount!.textContent!) - 1
      ).toString();
    }
  });
};

postButton!.onclick = () => {
  if ((messageInput as HTMLInputElement).value) {
    const message: ESNMessage = {
      sender: currentUser.username,
      sendee: "Post",
      content: (messageInput as HTMLInputElement).value,
      senderStatus: currentUserStatus,
    };
    recordMessage(message);
  }
};

socket.on("Post", renderMessage);

socket.on("delete post", deleteMessage);
