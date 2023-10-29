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

const userStatusList = document.getElementById("user-status-list");
const publicChatButton = document.getElementById("direct-chat");
const homeButton = document.getElementById("direct-home");
const directoryButton = document.getElementById("direct-directory");

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
