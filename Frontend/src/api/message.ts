import { ESNMessage } from "../types";
import {
  getAllPublicMessagesApi,
  postPublicMessageApi,
} from "./routes";
import { fetchRequest } from "./util";

export const getAllPublicMessages = async () => {
  return await fetchRequest(getAllPublicMessagesApi, "GET").then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("HTTP error: " + response.status);
    }
  });
};

export const postPublicMessage = async (message: ESNMessage) => {
  return await fetchRequest(postPublicMessageApi, "POST", {
    content: message.content,
    sender: message.sender,
    time: message.time,
    senderStatus: message.senderStatus,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("HTTP error: " + response.status);
    }
  });
};
