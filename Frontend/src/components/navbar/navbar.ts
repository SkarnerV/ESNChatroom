import { navBarContainer } from "../../templates/navbar/foot-navbar-template";

class Navbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = navBarContainer;
  }
}

customElements.define("esn-navbar", Navbar);

const homeList = document.getElementById("home");
const userStatusList = document.getElementById("user-status-list");
const publicChatButton = document.getElementById("direct-chat");
const homeButton = document.getElementById("direct-home");
const directoryButton = document.getElementById("direct-directory");
const waitlistButton = document.getElementById("direct-waitlist");

publicChatButton!.onclick = () => {
  window.location.href = "/chat.html?contact=Lobby";
};

waitlistButton!.onclick = async () => {
  window.location.href = "/foodWaitlist.html";
};

homeButton!.onclick = () => {
  userStatusList!.style.display = "none";
  homeList!.style.display = "block";
  changeHomePageHeaderText("Home");
};

directoryButton!.onclick = () => {
  userStatusList!.style.display = "block";
  homeList!.style.display = "none";
  changeHomePageHeaderText("Directory");
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
  window.location.href = "/moment.html";
};

directoryButton!.onclick = () => {
  window.location.href = "/home.html";
};
