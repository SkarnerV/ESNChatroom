import { UserStatusIcon } from "../../constant/user-status";
import { announcementTemplate } from "../../templates/announcement/announcement-template";
import { ESNMessage } from "../../types";
import jwt from "jsonwebtoken";
import { socket } from "../../util/socket";
import Formatter from "../../util/formatter";
import { getLastMessage, postESNMessage } from "../../api/message";
import { getUserStatusByUsername } from "../../api/user";
class Announcement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = announcementTemplate;
  }
}

customElements.define("esn-announcement", Announcement);
const currentUser = jwt.decode(localStorage.getItem("token"), "esn");

let currentUserStatus = "";

getUserStatusByUsername(currentUser.username).then((response) => {
  currentUserStatus = response.lastStatus;
});

getLastMessage(currentUser.username, "Announcement").then((response) => {
  if (response[0]) {
    replaceAnnouncement(response[0]);
  }
});
const searchButton = document.getElementById("search-icon");
const announcementButton = document.getElementById("announcement-button");
const announcementInput = document.getElementById("announcement-input");
searchButton!.onclick = () => {
  const searchModal = document.getElementById("search-modal");
  searchModal!.classList.remove("hidden");
  searchModal!.style.display = "block";
};

announcementButton!.onclick = () => {
  const message: ESNMessage = {
    sender: currentUser.username,
    sendee: "Announcement",
    content: (announcementInput as HTMLInputElement).value,
    senderStatus: currentUserStatus,
  };

  recordMessage(message);
};

const recordMessage = (message: ESNMessage) => {
  postESNMessage(message).then((response) => {
    if (response) {
      (announcementInput as HTMLInputElement).value = "";
    }
  });
};

const replaceAnnouncement = (message: ESNMessage) => {
  const announcementContent = document.getElementById("announcement-content");
  const announcementSender = document.getElementById("announcement-sender");
  const announcementStatus = document.getElementById("announcement-status");
  const announcementTime = document.getElementById("announcement-time");
  const userStatusIcon = UserStatusIcon[message.senderStatus];
  announcementContent!.textContent = message.content;
  announcementSender!.textContent = message.sender;
  announcementStatus!.innerHTML = userStatusIcon;
  announcementTime!.textContent = message.time
    ? Formatter.formatDate(new Date(parseInt(message.time)))
    : "";
};

socket.on("Announcement", replaceAnnouncement);
