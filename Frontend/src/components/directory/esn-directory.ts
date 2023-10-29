import { esnDirectoryContainer } from "../../templates/directory/esn-directory-template";

import { getAllUserStatus } from "../../api/user";
import { UserStatusIcon } from "../../constant/user-status";
import { ESNMessage, ESNUserStatus } from "../../types";

import jwt from "jsonwebtoken";
import { socket } from "../../util/socket";
import { IllegalUserActionHandler } from "../../util/illegalUserHandler";
import Formatter from "../../util/formatter";

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

const currentUser = jwt.decode(localStorage.getItem("token"), "esn");
const unreadUsers: string =
  localStorage.getItem("unreadUsers") || JSON.stringify([]);

let unreadUsersList: string[] = JSON.parse(unreadUsers) as string[];

let onlineUsers: string[] = [];

const userStatusList = document.getElementById("user-status-list");

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

const getSortableUserList = () => {
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
  const statusBody = document.createElement("li");
  const usernameBody = document.createElement("div");
  const userAvatarBody = document.createElement("div");
  const userAvatar = document.createElement("img");
  const usernameText = document.createElement("span");
  const userStatusInfoBody = document.createElement("div");
  const userStatusInfo = document.createElement("div");
  const unreadSign = document.createElement("div");
  const isCurrentUser = currentUser.username === userStatus.username;

  // statusBody.id = `user-${userStatus.username}-${userStatus.lastStatus}`;
  statusBody.id = `user-${userStatus.username}-${userStatus.lastStatus}`;
  statusBody.className = "flex bg-black justify-between py-5 px-4";
  usernameBody.className = "flex items-center gap-x-2";
  userAvatarBody.className = "relative";
  userAvatar.className = "h-8 w-8 flex-none rounded-full bg-gray-50";
  usernameText.className =
    "w-40 text-white text-sm font-semibold text-gray-900";

  usernameText.id = "user-directory-display-name";
  userStatusInfoBody.className =
    "shrink-0 sm:flex mt-1 flex items-center gap-x-1.5";
  unreadSign.className = "text-red-500";
  unreadSign.id = `${userStatus.username}-unread`;
  userStatusInfoBody.id = `${userStatus.username}-status-info-container`;
  userStatusInfo.className = "absolute top-0 right-0 w-3 h-3 rounded-full";
  userStatusInfo.id = `${userStatus.username}-last-status-info`;
  //Need Change for later
  userAvatar.src =
    "https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg";

  userStatusInfo.classList.add("bg-emerald-500");
  const userStatusSVGIcon = UserStatusIcon[userStatus.lastStatus];
  usernameText.textContent = userStatus.username;

  userAvatarBody.appendChild(userStatusInfo);
  userAvatarBody.appendChild(userAvatar);
  userStatusInfoBody.innerHTML += userStatusSVGIcon;
  unreadSign.textContent = "New Message!";
  usernameBody.appendChild(userAvatarBody);
  usernameBody.appendChild(usernameText);

  statusBody.appendChild(usernameBody);

  usernameText.textContent = Formatter.formatLongUsername(
    usernameText.textContent
  );

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

const updateUserStatus = () => {
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
