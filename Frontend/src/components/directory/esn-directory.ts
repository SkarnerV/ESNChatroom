import { esnDirectoryContainer } from "../../templates/directory/esn-directory-template";
import { getAllUserStatus } from "../../api/user";
import { ESNUserStatus } from "../../types";
import StatusClassifier from "../../util/statusClassifier";
import jwt from "jsonwebtoken";
import { socket } from "../../scripts/socket";
import { UserStatus } from "../../constants/user-status";

class ESNDirectory extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shouldDisplay = localStorage.getItem("esnDirectoryDisplay");

    // if (shouldDisplay !== "false") {
    this.innerHTML = esnDirectoryContainer;
    // }
  }
}

const currentUser = jwt.decode(localStorage.getItem("token"), "esn");

customElements.define("esn-directory", ESNDirectory);
const userStatusList = document.getElementById("user-status-list");
// Test user should be removed in the future
const testUsers: ESNUserStatus[] = [
  {
    username: "test1",
    lastStatus: UserStatus.GREEN,
    isOnline: true,
  },
  {
    username: "test2",
    lastStatus: UserStatus.YELLOW,
    isOnline: true,
  },
  {
    username: "test3",
    lastStatus: UserStatus.RED,
    isOnline: true,
  },
  {
    username: "test4",
    lastStatus: UserStatus.UNDEFINE,
    isOnline: true,
  }
]

getAllUserStatus().then((response) => {
  for (const userInfo of response) {
    renderStatus(userInfo);
  }
  // Test user should be removed in the future
  for (const userInfo of testUsers) {
    renderStatus(userInfo);
  }
  sortUserStatusList();
});

const sortUserStatusList = () => {
  const userStatusListChildren = userStatusList?.children;
  const userStatusListArray = Array.from(userStatusListChildren!).map(
    (e: Element) => {
      const userStatus = e.id.split("-");
      const username = userStatus[1];
      const lastStatus = userStatus[2];
      const isOnline = userStatus[3] === "true";
      return { e, username, lastStatus, isOnline };
    }
  );
  const status2Num = {
    [UserStatus.RED]: 0,
    [UserStatus.YELLOW]: 1,
    [UserStatus.GREEN]: 2,
    [UserStatus.UNDEFINE]: 3
  };
  userStatusListArray.sort((a, b) => {
    if (b.isOnline === a.isOnline) {
      if (a.lastStatus === b.lastStatus) {
        return a.username < b.username ? -1 : 1;
      }
      return status2Num[a.lastStatus] < status2Num[b.lastStatus] ? -1 : 1;
    }
    return b.isOnline ? 1 : -1;
  });
  for (const userStatus of userStatusListArray) {
    userStatusList?.appendChild(userStatus.e);
  }
};

const renderStatus = (userStatus: ESNUserStatus): void => {
  const statusBody = document.createElement("li");
  const usernameBody = document.createElement("div");
  const userAvatar = document.createElement("img");
  const usernameP = document.createElement("p");
  const userStatusInfoBody = document.createElement("div");
  const userStatusInfo = document.createElement("div");
  const userStatusP = document.createElement("div");
  const isCurrentUser = currentUser.username === userStatus.username;

  statusBody.id = `user-${userStatus.username}-${userStatus.lastStatus}-${
    isCurrentUser || userStatus.isOnline ? "true" : "false"
  }`;
  statusBody.className = "flex justify-between gap-x-6 py-5 px-4";
  if (!userStatus.isOnline && !isCurrentUser) {
    statusBody.classList.add("bg-gray-300");
  }
  usernameBody.className = "flex items-center min-w-0 gap-x-4";
  userAvatar.className = "h-9 w-9 flex-none rounded-full bg-gray-50";
  usernameP.className = "text-sm font-semibold leading-6 text-gray-900";
  userStatusInfoBody.className =
    "shrink-0 sm:flex mt-1 flex items-center gap-x-1.5";
  userStatusInfo.className = "h-2 w-2 rounded-full";
  userStatusP.className = "text-xs leading-5 text-gray-500";
  //Need Change for later
  userAvatar.src =
    "https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg";

  const htmlElement = StatusClassifier.classifyStatus(userStatus.lastStatus);

  userStatusInfo.classList.add(htmlElement[0]);
  userStatusP.textContent = htmlElement[1];
  usernameP.textContent = userStatus.username;
  if (isCurrentUser) {
    usernameP.textContent += " (Me)";
  }

  userStatusInfoBody.appendChild(userStatusInfo);
  userStatusInfoBody.appendChild(userStatusP);
  usernameBody.appendChild(userAvatar);
  usernameBody.appendChild(usernameP);
  statusBody.appendChild(usernameBody);
  statusBody.appendChild(userStatusInfoBody);
  userStatusList?.appendChild(statusBody);

  if (isCurrentUser) {
    const scroll = userStatusList || new HTMLDivElement();
    scroll.scrollTop = scroll.scrollHeight || 0;
  }
};

const quitButton = document.getElementById("quit-directory");

quitButton!.onclick = async () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

const updateUserStatus = (username: string, isOnline: boolean) => {
  const userStatusListChildren = userStatusList?.children;
  const userItem = Array.from(userStatusListChildren!).find((e: Element) => {
    const userStatus = e.id.split("-");
    return userStatus[1] === username;
  });
  const userStatus = userItem?.id.split("-");
  userItem!.id = `user-${userStatus![1]}-${userStatus![2]}-${
    isOnline ? "true" : "false"
  }`;
  if (!isOnline) {
    userItem!.classList.add("bg-gray-300");
  } else {
    userItem!.classList.remove("bg-gray-300");
  }
  sortUserStatusList();
};

socket.on("online", (username: string) => {
  updateUserStatus(username, true);
});

socket.on("offline", (username: string) => {
  updateUserStatus(username, false);
});
