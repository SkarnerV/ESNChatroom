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
const mapButton = document.getElementById("direct-map");
const waitlistButton = document.getElementById("direct-waitlist");

publicChatButton!.onclick = () => {
  window.location.href = "/chat.html?contact=Lobby";
};

mapButton!.onclick = () => {
  window.location.href = "/map.html";
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

const redirectPage = (pageName: string) => {
  
  if(window.location.pathname !== pageName)
    window.location.href = pageName;
}
