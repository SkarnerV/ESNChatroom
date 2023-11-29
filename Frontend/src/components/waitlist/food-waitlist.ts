import jwt from "jsonwebtoken";
import { foodWaitlistContainer } from "../../templates/foodWaitlist/food-waitlist-template";
import {
  getALLCitizenInfo,
  deleteCitizenFromWaitlist,
} from "../../api/waitlist";
import { generateWaitlistCitizen } from "../../util/render";
import { socket } from "../../util/socket";
import { IllegalUserActionHandler } from "../../util/illegalUserHandler";
import { ESNWaitlistUser } from "../../types";

class foodWaitlist extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = foodWaitlistContainer;
  }
}

customElements.define("food-waitlist", foodWaitlist);

IllegalUserActionHandler.redirectToLogin();

const backButton = document.getElementById("waitlist-back-button");
const currentUser = jwt.decode(localStorage.getItem("token"), "esn");
const dropButton = document.getElementById("drop-waitlist");
const donateFoodTo = document.getElementById("your-citizen");
const otherCitizens = document.getElementById("other-citizens");
const joinButton = document.getElementById("join-waitlist");
let waitlistUsers: string[] = [];

const getCitizenInfoData = async () => {
  getALLCitizenInfo().then((response) => {
    for (const userInfo of response) {
      if (userInfo) {
        if (!waitlistUsers.includes(userInfo.username)) {
          waitlistUsers.push(userInfo.username);
        }
        renderCitizenInfo(userInfo);
      }
    }
  });
};

backButton!.onclick = () => {
  window.location.href = "/home.html";
};

joinButton!.onclick = async () => {
  if (!waitlistUsers.includes(currentUser.username)) {
    const joinModal = document.getElementById("join-waitlist-modal");
    joinModal!.style.display = "block";
  }
};

dropButton!.onclick = async () => {
  if (waitlistUsers.includes(currentUser.username)) {
    await deleteCitizenFromWaitlist(currentUser.username);
  }
};

const renderCitizenInfo = (waitlistUser: ESNWaitlistUser): void => {
  const isCurrentUser = currentUser.username === waitlistUser.username;
  const isFoodDonor = currentUser.username === waitlistUser.foodDonor;

  const renderedElements = generateWaitlistCitizen(waitlistUser);
  const userBodyButton = renderedElements[0];
  const userStatusInfo = renderedElements[1];
  const usernameText = renderedElements[2];
  const userCommentsText = renderedElements[3];

  userStatusInfo.textContent = waitlistUser.waitlistStatus;
  userCommentsText.textContent = waitlistUser.foodComments;

  if (isFoodDonor) {
    donateFoodTo?.appendChild(userBodyButton);
    userBodyButton.onclick = async () => {
      const donateModal = document.getElementById("donate-waitlist-modal");
      const donateTitle = document.getElementById("donate-title");
      donateModal!.style.display = "block";
      donateTitle!.textContent = "Donation completed?";
      const username = userBodyButton.id.split("-")[1];
      const event = new CustomEvent("citizenName", {
        detail: { username: username, isRemoveFoodDonor: true },
      });
      document.dispatchEvent(event);
    };
  } else {
    otherCitizens?.appendChild(userBodyButton);
    if (isCurrentUser) {
      usernameText.textContent = "Me";
    } else {
      userBodyButton.onclick = async () => {
        const donateModal = document.getElementById("donate-waitlist-modal");
        const donateTitle = document.getElementById("donate-title");
        donateModal!.style.display = "block";
        donateTitle!.textContent = "Donate to: ";
        const username = userBodyButton.id.split("-")[1];
        const event = new CustomEvent("citizenName", {
          detail: { username: username },
        });
        document.dispatchEvent(event);
      };
    }
  }
};

const updateCitizen = (username: string, foodDonor: string) => {
  const citizenStatusToUpdate = document.getElementById(`user-${username}`);
  const foodComments =
    document.getElementById(`${username}-food-comments`)?.textContent || "";
  const updated: ESNWaitlistUser = {
    username: username,
    foodComments: foodComments,
    waitlistStatus: "MATCHED",
    foodDonor: foodDonor,
  };
  citizenStatusToUpdate?.remove();
  renderCitizenInfo(updated);
};

getCitizenInfoData().then(() => {
  socket.on("join waitlist", (newUser) => {
    const newCitizen: ESNWaitlistUser = {
      username: newUser.username,
      foodComments: newUser.foodComments,
      waitlistStatus: newUser.waitlistStatus,
      foodDonor: newUser.foodDonor,
    };
    waitlistUsers.push(newUser.username);
    renderCitizenInfo(newCitizen);
  });

  socket.on("drop waitlist", (username) => {
    const elementToRemove = document.getElementById(`user-${username}`);
    elementToRemove?.remove();
    waitlistUsers = waitlistUsers.filter((item) => item !== username);
  });

  socket.on("update waitlist", async (updatedUser) => {
    updateCitizen(updatedUser.username, updatedUser.foodDonor);
  });
});
