import jwt from "jsonwebtoken";
import { UserStatusIcon } from "../constant/user-status";
import {
  ESNMessage,
  ESNUserStatus,
  ESNWaitlistUser,
  FoodSharingSchedule,
} from "../types";

import Formatter from "./formatter";
import { deleteSchedule, updateSchedule } from "../api/schedule";

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
    "flex bg-gray-700 justify-between rounded-lg py-5 px-4 mt-2 mb-2 ml-1 mr-1 flex-grow";

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
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className =
    "w-12 h-16 text-sm font-semibold bg-gray-500 text-white p-1 mr-1 rounded flex-none";
  editButton.id = `edit-${userStatus.username}`;

  return [statusBody, userStatusInfoBody, usernameText, editButton];
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

export const generateWaitlistCitizen = (
  waitlistUser: ESNWaitlistUser
): HTMLElement[] => {
  const userBodyButton = document.createElement("button");
  const userBodyContainer = document.createElement("div");
  const userInfoContainer = document.createElement("div");
  const userAvatarContainer = document.createElement("div");
  const userAvatar = document.createElement("img");
  const userInfoTextBody = document.createElement("div");
  const usernameText = document.createElement("p");
  const userCommentsText = document.createElement("p");
  const userStatusInfo = document.createElement("span");

  userBodyButton.id = `user-${waitlistUser.username}`;
  userBodyButton.className = "w-full text-left";
  userBodyContainer.className =
    "flex items-center justify-between bg-black p-4";
  userInfoContainer.className = "flex items-center";
  userAvatarContainer.className = "flex items-center";
  userAvatar.className = "w-10 h-10 bg-gray-50 rounded-full mr-3";
  usernameText.className = "text-white font-semibold";
  userCommentsText.className = "text-gray-400 text-sm  break-normal break-all";
  userCommentsText.id = `${waitlistUser.username}-food-comments`;
  usernameText.id = "user-directory-display-name";
  userStatusInfo.className =
    "text-xs font-semibold bg-rose-500 text-white p-1 rounded";
  userStatusInfo.id = `${waitlistUser.username}-status-info`;
  userAvatar.src =
    "https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg";

  // const userStatusSVGIcon = UserStatusIcon[waitlistUser.lastStatus];
  usernameText.textContent = waitlistUser.username;

  userInfoTextBody.appendChild(usernameText);
  userInfoTextBody.appendChild(userCommentsText);
  userAvatarContainer.appendChild(userAvatar);
  userInfoContainer.appendChild(userAvatarContainer);
  userInfoContainer.appendChild(userInfoTextBody);
  userBodyContainer.appendChild(userInfoContainer);
  userBodyContainer.appendChild(userStatusInfo);
  userBodyButton.appendChild(userBodyContainer);

  usernameText.textContent = Formatter.formatLongUsername(
    usernameText.textContent
  );

  return [userBodyButton, userStatusInfo, usernameText, userCommentsText];
};

export const generateSchedule = (
  schedule: FoodSharingSchedule
): HTMLElement => {
  const date = schedule.time.split("_")[0];
  const time = schedule.time.split("_")[1];
  const scheduleBox = document.createElement("div");
  const scheduleEntry = document.createElement("div");
  scheduleEntry.className =
    "bg-gray-200 items-center rounded-lg shadow-md py-1 px-4 mb-3 ml-1 mr-1 text-center";
  scheduleEntry.setAttribute("id", schedule.scheduleid);
  const schedulerRow = document.createElement("div");
  schedulerRow.className = "text-sm font-normal mt-1";
  schedulerRow.textContent = `Scheduler: ${schedule.scheduler}`;

  const dateRow = document.createElement("div");
  dateRow.className = "text-lg font-bold";
  dateRow.textContent = `Date: ${date}`;

  const timeRow = document.createElement("div");
  timeRow.className = "text-lg font-bold";
  timeRow.textContent = `Time: ${time}`;

  const statusRow = document.createElement("div");
  statusRow.style.fontStyle = "italic";
  statusRow.textContent = `Status: ${schedule.status}`;

  // for scheduler
  const deleteButton = document.createElement("button");
  deleteButton.className = "bg-red-500 text-white rounded px-5 py-1 mt-1 mb-1";
  deleteButton.textContent = "Delete";

  // for scheduleee
  const acceptButton = document.createElement("button");
  acceptButton.className =
    "bg-green-500 text-white rounded px-2 py-1 mt-1 mr-5 mb-1";
  acceptButton.textContent = "Accept";
  const rejectButton = document.createElement("button");
  rejectButton.className =
    "bg-red-500 text-white rounded px-2 py-1 mt-1 ml-5 mb-1";
  rejectButton.textContent = "Reject";

  scheduleEntry.appendChild(schedulerRow);
  scheduleEntry.appendChild(dateRow);
  scheduleEntry.appendChild(timeRow);
  scheduleEntry.appendChild(statusRow);
  if (currentUser.username === schedule.scheduler)
    scheduleEntry.appendChild(deleteButton);

  // For schedulee, only if the schedule time is in the future and is currently in pending status
  if (
    currentUser.username === schedule.schedulee &&
    schedule.status === "Pending" &&
    new Date(schedule.time.split("_").join("T")).getTime() >=
      new Date().getTime()
  ) {
    scheduleEntry.appendChild(acceptButton);
    scheduleEntry.appendChild(rejectButton);
  }

  deleteButton.addEventListener("click", () => {
    deleteSchedule(schedule.scheduleid);
  });

  acceptButton.addEventListener("click", () => {
    updateSchedule(schedule.scheduleid, "Accept").then((response) => {
      statusRow.textContent = "Status: Accept";
      scheduleEntry.removeChild(acceptButton);
      scheduleEntry.removeChild(rejectButton);
    });
  });

  rejectButton.addEventListener("click", () => {
    updateSchedule(schedule.scheduleid, "Reject");
    statusRow.textContent = "Status: Reject";
    scheduleEntry.removeChild(acceptButton);
    scheduleEntry.removeChild(rejectButton);
  });

  return scheduleEntry;
};
