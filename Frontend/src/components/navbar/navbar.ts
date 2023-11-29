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
  window.location.href = "/moment.html";
};

directoryButton!.onclick = () => {
  window.location.href = "/home.html";
};
