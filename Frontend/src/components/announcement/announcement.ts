import { UserStatusIcon } from "../../constant/user-status";
import { announcementTemplate } from "../../templates/announcement/announcement-template";
import { ESNMessage } from "../../types";
import jwt from "jsonwebtoken";
import { socket } from "../../util/socket";
import Formatter from "../../util/formatter";
import { getLastMessage, postESNMessage } from "../../api/message";
import { getUserStatusByUsername } from "../../api/user";
import { searchInContext } from "../../api/search";
import { displayMessageResult } from "../../util/search";
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
searchButton!.onclick = async () => {
  const searchModal = document.getElementById("search-modal");
  // Set a data attribute 'context' to 'announcement' on the modal
  searchModal!.setAttribute("data-context", "announcements");
  searchModal!.style.display = "block";

  // Display all announcements
  const resultList = document.getElementById("search-result-area");
  const response = await searchInContext("announcements", "", "", "");
  displayMessageResult(resultList, response);
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
  const announcementTime = document.getElementById("announcement-time");
  announcementContent!.textContent = message.content;
  announcementSender!.textContent = message.sender;
  announcementTime!.textContent = message.time
    ? Formatter.formatDate(new Date(parseInt(message.time)))
    : "";
};

socket.on("Announcement", replaceAnnouncement);
