import jwt from "jsonwebtoken";
import stopWords from "../../constant/stop-words";
import { UserStatusIcon } from "../../constant/user-status";
import { SearchModalTemplate } from "../../templates/search/search-modal-template";
import { ESNMessage, ESNUserStatus } from "../../types";
import Formatter from "../../util/formatter";
import { IllegalUserActionHandler } from "../../util/illegalUserHandler";
import { generateUser, generateMessage } from "../../util/render";

class SearchModal extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = SearchModalTemplate;
  }
}
customElements.define("search-modal", SearchModal);
IllegalUserActionHandler.redirectToLogin();
const currentUser = jwt.decode(localStorage.getItem("token"), "esn");
const closeButton = document.getElementById("close-button");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultList = document.getElementById("search-result-area");

closeButton!.onclick = () => {
  const modal = document.getElementById("search-modal");
  if (modal) {
    resultList!.innerHTML = "";
    (searchInput as HTMLInputElement).value = "";
    modal!.style.display = "none";
  }
};
searchButton!.onclick = () => {
  resultList!.innerHTML = "";
  const searchText = (searchInput as HTMLInputElement).value;
  if (searchText === "") {
    const noSearchInputsMessage = document.createElement("p");
    noSearchInputsMessage.textContent =
      "Please provide a search category the search keywords";
    noSearchInputsMessage.className = "text-red-700 text-center my-4";
    resultList?.appendChild(noSearchInputsMessage);
  } else {
    const searchWords = filterStopWords();

    // Only stop words contain in search input
    if (searchWords! === "") {
      const noSearchTermsMessage = document.createElement("p");
      noSearchTermsMessage.textContent = "No match keywords found";
      noSearchTermsMessage.className = "text-gray-700 text-center my-4";
      resultList?.appendChild(noSearchTermsMessage);
    } else {
      //Perform Search [To be implemented] for searchWords and display result
      displayUserResult();
      displayMessageResult();
      resultList!.scrollTop = 0;
    }
  }
};

const filterStopWords = (): string => {
  const searchText = (searchInput as HTMLInputElement).value;
  const words = searchText.split(/\s+/);
  const filteredWords = words.filter(
    (word) => !stopWords.includes(word.toLowerCase())
  );
  return filteredWords.join(" ");
};

// Sample Data for userList
const userList = [
  { lastStatus: "GREEN", username: "aaa1" },
  { lastStatus: "YELLOW", username: "aaa2" },
  { lastStatus: "GREEN", username: "aaa3" },
];
// Sample Data for messageList
const messageList = [
  {
    id: 1,
    content: "this is a test mesage1",
    time: "12:11 PM",
    sender: "asdf",
    sendee: "Lobby",
    senderStatus: "GREEN",
  },
  {
    id: 2,
    content: "this is a test mesage2",
    time: "12:11 PM",
    sender: "asd",
    sendee: "Lobby",
    senderStatus: "GREEN",
  },
];

const displayUserResult = async () => {
  for (const userInfo of userList) {
    renderUser(userInfo);
  }
};
const displayMessageResult = () => {
  const maxDisplay = 10;
  for (let i = 0; i < maxDisplay && messageList.length > 0; i++) {
    const messageInfo = messageList.shift(); // Remove and get the first item from messageList
    renderMessage(messageInfo!);

    // Reach end of search result
    if (messageList.length === 0) {
      const endOfSearchMessage = document.createElement("p");
      endOfSearchMessage.textContent = "End of search result";
      endOfSearchMessage.className = "text-black text-center my-4";
      resultList?.appendChild(endOfSearchMessage);
    }
  }

  // Add "Show More" button if there are more items to display in messageList
  if (messageList.length > 0) {
    const showMoreButton = document.createElement("button");
    showMoreButton.textContent = "Show More";
    showMoreButton.className =
      "bg-blue-500 text-white px-4 py-2 rounded-md mt-2 mb-2 mx-auto block";
    showMoreButton!.onclick = () => {
      displayMessageResult();
      showMoreButton.remove();
    };
    resultList?.appendChild(showMoreButton);
  }
};

const renderUser = (userStatus: ESNUserStatus): void => {
  const renderedElements = generateUser(userStatus);
  const statusBody = renderedElements[0];
  const userStatusInfoBody = renderedElements[1];
  statusBody.appendChild(userStatusInfoBody);
  resultList?.appendChild(statusBody);
};

const renderMessage = (message: ESNMessage): void => {
  const renderedElements = generateMessage(message);
  const messageHeader = renderedElements[0];
  const messageBubble = renderedElements[1];
  resultList?.appendChild(messageHeader);
  resultList?.appendChild(messageBubble);
  const scroll = resultList || new HTMLDivElement();
  scroll.scrollTop = scroll.scrollHeight || 0;
};
