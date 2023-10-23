import { esnDirectoryContainer } from "../../templates/directory/esn-directory-template";
import { navBarContainer } from "../../templates/navbar/foot-navbar-template";
import { getAllUserStatus, updateLastStatus } from "../../api/user";
import { UserStatus, UserStatusIcon } from "../../constants/user-status";
import { ESNMessage, ESNUserStatus } from "../../types";
import StatusClassifier from "../../util/statusClassifier";
import jwt from "jsonwebtoken";
import { socket } from "../../util/socket";
import { IllegalUserActionHandler } from "../../util/illegalUserHandler";

class ESNDirectory extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = esnDirectoryContainer + navBarContainer;
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
const speedTestButton = document.getElementById("speedtest-directory");
speedTestButton!.onclick = () => {
  window.location.href = "/ESNSpeedTest.html";
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

const sortUserStatusList = () => {
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

  const htmlElement = StatusClassifier.classifyStatus(userStatus.lastStatus);
  userStatusInfo.classList.add(htmlElement[0]);
  const userStatusSVGIcon = htmlElement[1];
  usernameText.textContent = userStatus.username;

  if (usernameText.textContent.length > 16) {
    usernameText.textContent = usernameText.textContent.slice(0, 12) + "...";
  }

  if (isCurrentUser) {
    usernameText.textContent = "Me";
    const myStatusSelection = document.getElementById(
      `status-${userStatus.lastStatus}`
    ) as HTMLInputElement;
    myStatusSelection!.checked = true;
  }

  userAvatarBody.appendChild(userStatusInfo);
  userAvatarBody.appendChild(userAvatar);
  userStatusInfoBody.innerHTML += userStatusSVGIcon;
  unreadSign.textContent = "New Message!";
  usernameBody.appendChild(userAvatarBody);
  usernameBody.appendChild(usernameText);

  statusBody.appendChild(usernameBody);

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

document.addEventListener("DOMContentLoaded", () => {
  const statusButton = document.getElementById("change-status");
  const dropdownMenu = document.getElementById("status-dropdown");

  statusButton?.addEventListener("click", () => {
    if (
      dropdownMenu?.classList.contains("hidden") &&
      statusButton.classList.contains("rounded-b")
    ) {
      statusButton.classList.remove("rounded-b");
      dropdownMenu.classList.remove("hidden");
    } else {
      dropdownMenu?.classList.add("hidden");
      statusButton.classList.add("rounded-b");
    }
  });

  // Optional: Close the dropdown when clicked outside
  document.addEventListener("click", (event) => {
    if (
      event.target !== statusButton &&
      !statusButton?.contains(event.target as Node)
    ) {
      dropdownMenu?.classList.add("hidden");
      statusButton?.classList.add("rounded-b");
    }
  });
});

const quitButton = document.getElementById("quit-directory");
const publicChatButton = document.getElementById("direct-chat");
const homeButton = document.getElementById("direct-home");
const directoryButton = document.getElementById("direct-directory");

const radios = document.querySelectorAll('input[type="radio"][name="status"]');
radios.forEach((radio) => {
  radio.addEventListener("change", async function () {
    if (this.checked) {
      await updateLastStatus(currentUser.username, this.value);
    }
  });
});

quitButton!.onclick = async () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

publicChatButton!.onclick = async () => {
  window.location.href = "/chat.html?contact=Lobby";
};

homeButton!.onclick = () => {
  userStatusList!.style.display = "none";
  changeHomePageHeaderText("Home");
};

directoryButton!.onclick = () => {
  userStatusList!.style.display = "block";
  changeHomePageHeaderText("Directory");
};

const changeLastStatus = (
  userItem: HTMLLIElement,
  lastStatus: string,
  currentStatus: string,
  username: string
) => {
  const statusIcon = userItem.querySelector(`#icon-${lastStatus}`);
  const statusInfoBody = userItem.querySelector(
    `#${username}-status-info-container`
  );

  if (statusIcon) {
    statusIcon.remove();
  }
  if (currentStatus === UserStatus.RED) {
    statusInfoBody!.innerHTML += UserStatusIcon.RED;
  }
  if (currentStatus === UserStatus.YELLOW) {
    statusInfoBody!.innerHTML += UserStatusIcon.YELLOW;
  }
  if (currentStatus === UserStatus.GREEN) {
    statusInfoBody!.innerHTML += UserStatusIcon.GREEN;
  }
  if (currentStatus === UserStatus.UNDEFINE) {
    statusInfoBody!.innerHTML += UserStatusIcon.UNDEFINE;
  }

  userItem.id = `user-${username}-${currentStatus}`;
};

const addOfflineTag = (
  userItem: HTMLLIElement,
  isOnline: boolean,
  username: string
) => {
  const statusInfo = userItem.querySelector(`#${username}-last-status-info`);
  if (statusInfo) {
    if (!isOnline) {
      statusInfo.classList.remove("bg-emerald-500");
      statusInfo.classList.add("bg-gray-500");
    } else {
      statusInfo.classList.remove("bg-gray-500");
      statusInfo.classList.add("bg-emerald-500");
    }
  }
};

const changeHomePageHeaderText = (pageName: string) => {
  const homePageHeaderText = document.getElementById("home-page-header");
  if (homePageHeaderText) {
    if (pageName == "Home") {
      homePageHeaderText.textContent = "Home";
    } else if (pageName == "Directory") {
      homePageHeaderText.textContent = "Directory";
    }
  }
};

const updateUserStatus = () => {
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

  userItems.forEach((userItem) => {
    const username = userItem.id.split("-")[1];
    if (!onlineUsers.includes(username)) {
      addOfflineTag(userItem, false, username);
    } else {
      addOfflineTag(userItem, true, username);
    }
  });
};

const updateUserLastStatus = (username: string, currentStatus: string) => {
  const userItems = document.querySelectorAll("li");

  userItems.forEach((userItem) => {
    const usernameHTML = userItem.id.split("-")[1];
    const lastStatus = userItem.id.split("-")[2];
    if (userItem && username == usernameHTML) {
      changeLastStatus(userItem, lastStatus, currentStatus, username);
    }
  });
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
