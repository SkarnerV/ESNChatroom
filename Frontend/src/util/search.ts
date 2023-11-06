import { generateUser, generateMessage } from "./render";
import { ESNMessage, ESNUserStatus } from "../types";
import {
  updateUserStatus,
  getSortableUserList,
} from "../components/directory/esn-directory";

const renderUser = (resultList, userStatus: ESNUserStatus): void => {
  const renderedElements = generateUser(userStatus);
  const statusBody = renderedElements[0];
  const userStatusInfoBody = renderedElements[1];
  statusBody.appendChild(userStatusInfoBody);
  resultList?.appendChild(statusBody);
};

// Function to find the index of the user in the original list
function findOriginalIndex(username, originalList) {
  return originalList.findIndex((item) => item.username === username);
}

export const displayUserResult = async (resultList, userList) => {
  const sortableUserList = getSortableUserList();

  // Map the search results to their original list order
  const orderedSearchResults = userList
    .map((searchItem) => {
      // Find the original item that matches the username
      const originalIndex = findOriginalIndex(
        searchItem.username,
        sortableUserList
      );
      return { ...searchItem, originalIndex }; // Add the original index to the search item
    })
    .sort((a, b) => {
      // Sort the items by the original index
      return a.originalIndex - b.originalIndex;
    })
    .map((item) => {
      // Remove the original index before rendering
      const { originalIndex, ...resultItem } = item;
      return resultItem;
    });

  // Append sorted users
  orderedSearchResults.forEach((userStatus) => {
    renderUser(resultList, userStatus);
  });
  updateUserStatus();
};

const renderMessage = (resultList, message: ESNMessage): void => {
  const renderedElements = generateMessage(message);
  const messageHeader = renderedElements[0];
  const messageBubble = renderedElements[1];
  resultList?.appendChild(messageHeader);
  resultList?.appendChild(messageBubble);
};

export const displayMessageResult = (resultList, messageList) => {
  // Define the maximum number of messages to display at a time
  const maxDisplay = 10;

  // Helper function to render messages
  const loadMessages = () => {
    let count = 0;
    while (count < maxDisplay && messageList.length > 0) {
      const messageInfo = messageList.shift(); // Remove and get the first item from the messageList
      renderMessage(resultList, messageInfo); // Render the message
      count++;
    }
  };

  // Initial load of messages
  loadMessages();

  // Add "Show More" button if there are more items to display in messageList
  if (messageList.length > 0) {
    const showMoreButton = document.createElement("button");
    showMoreButton.textContent = "Show More";
    showMoreButton.className =
      "bg-blue-500 text-white px-4 py-2 rounded-md mt-2 mb-2 mx-auto block";
    showMoreButton.onclick = () => {
      loadMessages(); // Load more messages when the button is clicked

      // Move the "Show More" button to the end of the list if there are more messages to show
      resultList.appendChild(showMoreButton);

      // If there are no more messages after loading, remove the "Show More" button
      if (messageList.length === 0) {
        showMoreButton.remove();
      }
    };
    resultList?.appendChild(showMoreButton);
  }

  // After inserting the new message
  resultList.scrollTop = 0; // This will scroll the resultList to the top
};
