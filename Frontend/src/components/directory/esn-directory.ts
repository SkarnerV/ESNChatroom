import { esnDirectoryContainer } from "../../templates/directory/esn-directory-template";

import { getAllUserStatus } from "../../api/user";
import { UserStatusIcon } from "../../constant/user-status";
import { ESNMessage, ESNUserStatus } from "../../types";

import jwt from "jsonwebtoken";
import { socket } from "../../util/socket";
import { IllegalUserActionHandler } from "../../util/illegalUserHandler";
import Formatter from "../../util/formatter";
import { generateUser } from "../../util/render";

class ESNDirectory extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = esnDirectoryContainer;
  }
}

customElements.define("esn-directory", ESNDirectory);

IllegalUserActionHandler.redirectToLogin();
const searchButton = document.getElementById("search-icon");
const currentUser = jwt.decode(localStorage.getItem("token"), "esn");
const unreadUsers: string =
  localStorage.getItem("unreadUsers") || JSON.stringify([]);

let unreadUsersList: string[] = JSON.parse(unreadUsers) as string[];

let onlineUsers: string[] = [];

const userStatusList = document.getElementById("user-status-list");

searchButton!.onclick = async () => {
  const searchModal = document.getElementById("search-modal");
  // Set a data attribute 'context' to 'citizens' on the modal
  searchModal!.setAttribute("data-context", "citizens");
  searchModal!.style.display = "block";

  // // Display all users
  // const resultList = document.getElementById("search-result-area");
  // const clonedMessageContent = userStatusList!.cloneNode(true);
  // resultList!.appendChild(clonedMessageContent);
};

const getUserStatusData = async () => {
  getAllUserStatus().then((response) => {
    userStatusList!.innerHTML = "";
    for (const userInfo of response) {
      renderStatus(userInfo);
    }
    updateUserStatus();
    sortUserStatusList();
  });
};

export const getSortableUserList = () => {
  const userStatusListChildren = userStatusList?.children;
  const userStatusListArray = Array.from(userStatusListChildren!).map(
    (e: Element) => {
      const userStatus = e.id.split("-");
      const username = userStatus[1];
      const isCurrentUser = currentUser.username === username;
      const lastStatus = userStatus[2];
      const isOnline = onlineUsers.includes(username);
      return { e, username, lastStatus, isOnline, isCurrentUser };
    }
  );

  return userStatusListArray;
};

const sortUserStatusList = () => {
  const userStatusListArray = getSortableUserList();

  userStatusListArray.sort((a, b) => {
    if (a.isCurrentUser) {
      return -1;
    }
    if (b.isCurrentUser) {
      return 1;
    }
    if (b.isOnline === a.isOnline) {
      return a.username < b.username ? -1 : 1;
    }
    return b.isOnline ? 1 : -1;
  });
  for (const userElement of userStatusListArray) {
    userStatusList?.appendChild(userElement.e);
  }
};

const renderStatus = (userStatus: ESNUserStatus): void => {
  const unreadSign = document.createElement("div");
  const isCurrentUser = currentUser.username === userStatus.username;

  unreadSign.className = "text-red-500";
  unreadSign.id = `${userStatus.username}-unread`;
  unreadSign.textContent = "New Message!";

  const renderedElements = generateUser(userStatus);
  const statusBody = renderedElements[0];
  const userStatusInfoBody = renderedElements[1];
  const usernameText = renderedElements[2];

  if (isCurrentUser) {
    usernameText.textContent = "Me";
    const myStatusSelection = document.getElementById(
      `status-${userStatus.lastStatus}`
    ) as HTMLInputElement;
    myStatusSelection!.checked = true;
  }

  if (!unreadUsersList.includes(userStatus.username)) {
    unreadSign!.style.display = "none";
  } else {
    unreadSign!.style.display = "block";
  }
  statusBody.appendChild(unreadSign);
  statusBody.appendChild(userStatusInfoBody);

  userStatusList?.appendChild(statusBody);
  if (!isCurrentUser) {
    statusBody.onclick = () => {
      unreadUsersList = unreadUsersList.filter(
        (username) => username !== userStatus.username
      );
      localStorage.setItem("unreadUsers", JSON.stringify(unreadUsersList));
      window.location.href = "chat.html?contact=" + userStatus.username;
    };
  }
};

export const updateUserStatus = () => {
  const userItems = document.querySelectorAll("li");
  updateNewUsersStatue();
  userItems.forEach((userItem) => {
    const username = userItem.id.split("-")[1];
    const statusInfo = userItem.querySelector(`#${username}-last-status-info`);

    if (statusInfo) {
      const isOnline = onlineUsers.includes(username);
      statusInfo.classList.toggle("bg-emerald-500", isOnline);
      statusInfo.classList.toggle("bg-gray-500", !isOnline);
    }
  });
};

const updateNewUsersStatue = () => {
  const userItems = document.querySelectorAll("li");
  // check if new user exists
  onlineUsers.forEach((username) => {
    let isNewUser = true;
    userItems.forEach((userItem) => {
      const user = userItem.id.split("-")[1];
      if (user === username) {
        isNewUser = false;
      }
    });
    if (isNewUser) {
      getUserStatusData();
    }
  });
};

const updateUserLastStatus = (username: string, currentStatus: string) => {
  const userItem = document.getElementById(`${username}-status-info-container`);
  // Replace the existing SVG element with the newSVG
  userItem!.innerHTML = ""; // Remove the existing content in the container
  userItem!.innerHTML += UserStatusIcon[currentStatus];
};

getUserStatusData().then(() => {
  socket.on("online users", (users: string[]) => {
    onlineUsers = users;
    updateUserStatus();
    sortUserStatusList();
  });

  socket.on("last status", (userStatus: string[]) => {
    const username = userStatus[0];
    const currentStatus = userStatus[1];
    updateUserLastStatus(username, currentStatus);
    sortUserStatusList();
  });
});

const updateUnreadUsers = (message: ESNMessage) => {
  if (
    message.sendee === currentUser.username &&
    !unreadUsersList.includes(message.sender)
  ) {
    unreadUsersList.push(message.sender);

    const unreadUser = document.getElementById(`${message.sender}-unread`);
    localStorage.setItem("unreadUsers", JSON.stringify(unreadUsersList));
    unreadUser!.style.display = "block";
  }
};

socket.on("private message", updateUnreadUsers);
