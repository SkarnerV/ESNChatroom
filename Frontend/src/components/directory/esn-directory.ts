import { esnDirectoryContainer } from "../../templates/directory/esn-directory-template";
import { getAllUserStatus } from "../../api/user";
import { ESNUserStatus } from "../../types";
import { UserStatus } from "../../constants/user-status";
import StatusClassifier from "../../util/statusClassifier";
import jwt from "jsonwebtoken";

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

getAllUserStatus().then((response) => {
  let userStatusRed: ESNUserStatus[] = [];
  let userStatusYellow: ESNUserStatus[] = [];
  let userStatusGreen: ESNUserStatus[] = [];
  let userStatusUndefine: ESNUserStatus[] = [];
  let sortFunction = function (a, b) {
    return a.username < b.username ? -1 : a.username == b.username ? 0 : 1;
  };

  for (const userInfo of response) {
    if (userInfo.lastStatus === UserStatus.RED) {
      userStatusRed.push(userInfo);
    } else if (userInfo.lastStatus === UserStatus.YELLOW) {
      userStatusYellow.push(userInfo);
    } else if (userInfo.lastStatus === UserStatus.GREEN) {
      userStatusGreen.push(userInfo);
    } else if (userInfo.lastStatus === UserStatus.UNDEFINE) {
      userStatusUndefine.push(userInfo);
    }
  }

  const usersStatus: ESNUserStatus[] = userStatusRed
    .sort(sortFunction)
    .concat(
      userStatusYellow.sort(sortFunction),
      userStatusGreen.sort(sortFunction),
      userStatusUndefine.sort(sortFunction)
    );

  for (const userStatusInfo of usersStatus) {
    renderStatus(userStatusInfo);
  }
});

const renderStatus = (userStatus: ESNUserStatus): void => {
  const statusBody = document.createElement("li");
  const usernameBody = document.createElement("div");
  const userAvatar = document.createElement("img");
  const usernameP = document.createElement("p");
  const userStatusInfoBody = document.createElement("div");
  const userStatusInfo = document.createElement("div");
  const userStatusP = document.createElement("div");
  const currentUserStatus = currentUser.username === userStatus.username;

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
  if (currentUserStatus) {
    usernameP.textContent += " (Me)";
  }

  userStatusInfoBody.appendChild(userStatusInfo);
  userStatusInfoBody.appendChild(userStatusP);
  usernameBody.appendChild(userAvatar);
  usernameBody.appendChild(usernameP);
  statusBody.appendChild(usernameBody);
  statusBody.appendChild(userStatusInfoBody);
  userStatusList?.appendChild(statusBody);

  if (currentUserStatus) {
    const scroll = userStatusList || new HTMLDivElement();
    scroll.scrollTop = scroll.scrollHeight || 0;
  }
};

const directory_display = document.getElementById("directory_display");
const quitButton = document.getElementById("quit-directory");

quitButton!.onclick = async () => {
  directory_display!.style.display = "none";
  // localStorage.setItem("esnDirectoryDisplay", "false");
};
