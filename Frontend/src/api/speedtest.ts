import { ESNMessage } from "../types";
import { speedTestApi } from "./routes";
import { fetchRequest } from "./util";

export const speedTestStart = async (sender: string) => {
  return await fetchRequest(
    `${speedTestApi}/speed_test_start/${sender}`,
    "PUT"
  ).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("HTTP error: " + response.status);
    }
  });
};

export const speedTestEnd = async (sender: string) => {
  return await fetchRequest(
    `${speedTestApi}/speed_test_end/${sender}`,
    "PUT"
  ).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("HTTP error: " + response.status);
    }
  });
};

export const speedTestGet = async (sender: string) => {
  return await fetchRequest(
    `${speedTestApi}/speed_test_get/${sender}`,
    "GET"
  ).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("HTTP error: " + response.status);
    }
  });
};

export const speedTestPost = async (message: ESNMessage) => {
  return await fetchRequest(`${speedTestApi}/speed_test_post`, "POST", {
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
