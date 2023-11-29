import jwt from "jsonwebtoken";
import { SearchModalTemplate } from "../../templates/search/search-modal-template";
import { displayMessageResult, displayUserResult } from "../../util/search";
import { searchInContext } from "../../api/search";

class SearchModal extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = SearchModalTemplate;
  }
}
customElements.define("search-modal", SearchModal);
const closeButton = document.getElementById("close-button");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultList = document.getElementById("search-result-area");
const searchModal = document.getElementById("search-modal");

closeButton!.onclick = () => {
  if (searchModal) {
    resultList!.innerHTML = "";
    (searchInput as HTMLInputElement).value = "";
    searchModal!.style.display = "none";
  }
};

searchButton!.onclick = async () => {
  resultList!.innerHTML = "";

  const searchText = (searchInput as HTMLInputElement).value;
  if (searchText === "") {
    displayNoInputMessage();
  } else {
    await performSearch(searchText);
  }
};

const performSearch = async (criteria) => {
  const context = searchModal!.getAttribute("data-context");
  const statusMap = { OK: "GREEN", Help: "YELLOW", Emergency: "RED" };

  try {
    const response = await executeSearch(context, criteria, statusMap);
    processResponse(response, context);
  } catch (error) {
    console.error("Search failed:", error);
    displayErrorMessage(error);
  }
};

const executeSearch = async (context, criteria, statusMap) => {
  switch (context) {
    case "messages":
      return handleMessagesContext(criteria);
    case "citizens":
      return searchInContext(context, statusMap[criteria] || criteria);
    case "announcements":
      return searchInContext(context, criteria);
    default:
      throw new Error("Invalid search context");
  }
};

const handleMessagesContext = async (criteria) => {
  const sender = searchModal!.getAttribute("data-sender");
  const sendee = searchModal!.getAttribute("data-sendee");
  if (sendee === "Lobby") {
    return searchInContext("messages", criteria, "", sendee);
  } else if (sender && sendee) {
    return searchInContext("messages", criteria, sender, sendee);
  }
  throw new Error("Sender or Sendee is not specified");
};

const processResponse = (response, context) => {
  if (response && response.length === 0) {
    displayStopWordsMessage();
  } else if (response) {
    if (context === "messages" || context === "announcements") {
      displayMessageResult(resultList, response);
    } else if (context === "citizens") {
      displayUserResult(resultList, response);
    }
  }
};

// Assuming displayMessage is defined elsewhere, no changes needed if it's already an arrow function

const displayNoInputMessage = () => {
  const message = document.createElement("p");
  message.textContent = "Please enter some keywords to search.";
  message.className = "text-red-700 text-center my-4";
  resultList?.appendChild(message);
};

const displayStopWordsMessage = () => {
  const message = document.createElement("p");
  message.textContent =
    "Your search query did not return any results. Please try different keywords.";
  message.className = "text-gray-700 text-center my-4";
  resultList?.appendChild(message);
};

const displayErrorMessage = (error) => {
  const message = document.createElement("p");
  message.textContent = `An error occurred: ${error.message}`;
  message.className = "text-red-700 text-center my-4";
  resultList?.appendChild(message);
};
