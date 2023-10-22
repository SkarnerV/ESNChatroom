import { ESNMessage } from "../types";
import { messagesApi } from "./routes";
import { fetchRequest } from "./util";

export const getAllMessages = async (sender: string, sendee: string) => {
  return await fetchRequest(messagesApi + sender + "/" + sendee, "GET").then(
    (response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("HTTP error: " + response.status);
      }
    }
  );
};

export const postESNMessage = async (message: ESNMessage) => {
  return await fetchRequest(messagesApi, "POST", {
    content: message.content,
    sender: message.sender,
    sendee: message.sendee,
    senderStatus: message.senderStatus,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("HTTP error: " + response.status);
    }
  });
};

export const getUnreadMessages = async (sendee: string) => {
  return await fetchRequest(messagesApi + sendee, "GET").then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("HTTP error: " + response.status);
    }
  });
};
