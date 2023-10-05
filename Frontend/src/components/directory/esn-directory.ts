import { esnDirectoryContainer } from "../../templates/directory/esn-directory-template";
import { getAllUserStatus, updateOnlineStatus } from "../../api/user";
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
let onlineUsers: string[] = [];

customElements.define("esn-directory", ESNDirectory);
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

const sortUserStatusList = () => {
  const userStatusListChildren = userStatusList?.children;
  const userStatusListArray = Array.from(userStatusListChildren!).map(
    (e: Element) => {
      const userStatus = e.id.split("-");
      const username = userStatus[1];
      const lastStatus = userStatus[2];
      const isOnline = !e.classList.contains("bg-gray-300");
      return { e, username, lastStatus, isOnline };
    }
  );
  const status2Num = {
    [UserStatus.RED]: 0,
    [UserStatus.YELLOW]: 1,
    [UserStatus.GREEN]: 2,
    [UserStatus.UNDEFINE]: 3,
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
  for (const userElement of userStatusListArray) {
    userStatusList?.appendChild(userElement.e);
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

  statusBody.id = `user-${userStatus.username}-${userStatus.lastStatus}`;
  statusBody.className = "flex justify-between gap-x-6 py-5 px-4";
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
  await updateOnlineStatus(currentUser.username, "false");
  socket.emit("offline", currentUser.username);
  localStorage.removeItem("token");
  window.location.href = "/";
};

const updateUserStatus = () => {
  const userItems = document.querySelectorAll("li");

  // check if new user exists
  let hasNewUser = false;
  onlineUsers.forEach((username) => {
    let isNewUser = true;
    userItems.forEach((userItem) => {
      const user = userItem.id.split("-")[1];
      if (user === username) {
        isNewUser = false;
      }
    });
    if (isNewUser) {
      hasNewUser = true;
      getUserStatusData();
    }
  });

  userItems.forEach((userItem) => {
    const username = userItem.id.split("-")[1];
    if (!onlineUsers.includes(username)) {
      userItem.classList.add("bg-gray-300");
    } else {
      userItem.classList.remove("bg-gray-300");
    }
  });
};

getUserStatusData().then(() => {
  socket.on("online users", (users: string[]) => {
    onlineUsers = users;
    updateUserStatus();
    sortUserStatusList();
  });
});
