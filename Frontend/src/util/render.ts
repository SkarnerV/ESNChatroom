import jwt from "jsonwebtoken";
import { UserStatusIcon } from "../constant/user-status";
import { ESNMessage, ESNUserStatus } from "../types";
import Formatter from "./formatter";

const currentUser = jwt.decode(localStorage.getItem("token"), "esn");

export const generateUser = (userStatus: ESNUserStatus): HTMLElement[] => {
  const statusBody = document.createElement("li");
  const usernameBody = document.createElement("div");
  const userAvatarBody = document.createElement("div");
  const userAvatar = document.createElement("img");
  const usernameText = document.createElement("span");
  const userStatusInfoBody = document.createElement("div");
  const userStatusInfo = document.createElement("div");
  // statusBody.id = `user-${userStatus.username}-${userStatus.lastStatus}`;
  statusBody.id = `user-${userStatus.username}-${userStatus.lastStatus}`;
  statusBody.className =
    "flex bg-gray-700 justify-between rounded-lg py-5 px-4 mt-2 mb-2 ml-1 mr-1";
  usernameBody.className = "flex items-center gap-x-2";
  userAvatarBody.className = "relative";
  userAvatar.className = "h-8 w-8 flex-none rounded-full bg-gray-50";
  usernameText.className =
    "w-40 text-white text-sm font-semibold text-gray-900";

  usernameText.id = "user-directory-display-name";
  userStatusInfoBody.className =
    "shrink-0 sm:flex mt-1 flex items-center gap-x-1.5";
  userStatusInfoBody.id = `${userStatus.username}-status-info-container`;
  userStatusInfo.className = "absolute top-0 right-0 w-3 h-3 rounded-full";
  userStatusInfo.id = `${userStatus.username}-last-status-info`;
  userAvatar.src =
    "https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg";

  userStatusInfo.classList.add("bg-emerald-500");
  const userStatusSVGIcon = UserStatusIcon[userStatus.lastStatus];
  usernameText.textContent = userStatus.username;

  userAvatarBody.appendChild(userStatusInfo);
  userAvatarBody.appendChild(userAvatar);
  userStatusInfoBody.innerHTML += userStatusSVGIcon;
  usernameBody.appendChild(userAvatarBody);
  usernameBody.appendChild(usernameText);

  statusBody.appendChild(usernameBody);

  usernameText.textContent = Formatter.formatLongUsername(
    usernameText.textContent
  );

  return [statusBody, userStatusInfoBody, usernameText];
};

export const generateMessage = (message: ESNMessage): HTMLElement[] => {
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
    "bg-gray-700 items-center rounded-lg shadow-md py-4 px-4 mb-2 ml-1 mr-1 w-full";
  messageContent.className =
    "items-center justify-start ml-2 mt-1 mb-1 text-white break-normal break-all";
  messageHeader.className = "flex justify-between items-center mb-2";
  userInfoBody.className = "flex space-x-2 justify-between items-center";
  userAvatarContainer.className = "min-w-1/10 w-1/10";
  userAvatar.className = "rounded-full h-10 w-10 bg-gray-500";
  currentUserAvatarContainer.className = "min-w-1/10 w-1/10 items-center";
  currentUserAvatar.className = "rounded-full h-10 w-10 bg-gray-500";
  userNickname.className = "text-gray-700 ml-1 font-semibold";
  messageTime.className = "text-gray-700 mr-1";

  messageContent.textContent = message.content;
  userNickname.textContent = currentUserMessager ? "Me" : message.sender;

  const userStatusIcon = UserStatusIcon[message.senderStatus];

  messageTime.textContent = message.time
    ? Formatter.formatDate(new Date(parseInt(message.time)))
    : "";
  userInfoBody.appendChild(userNickname);
  userInfoBody.innerHTML += userStatusIcon;
  messageHeader.appendChild(userInfoBody);
  messageHeader.appendChild(messageTime);
  messageBody.appendChild(messageContent);

  messageBubble.appendChild(userAvatarContainer);
  messageBubble.appendChild(messageBody);
  messageBubble.appendChild(currentUserAvatarContainer);

  return [messageHeader, messageBubble];
};
