import { ESNMessage } from "../types";
import { messagesApi } from "./routes";
import { fetchRequest } from "./util";

export const likeMessage = async (postId: number, username: string) => {
  return await fetchRequest(messagesApi + "/likes", "PUT", {
    postId: postId.toString(),
    username: username,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("HTTP error: " + response.status);
    }
  });
};

export const removeMessage = async (postId: string) => {
  return await fetchRequest(messagesApi + `/${postId}`, "DELETE").then(
    (response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("HTTP error: " + response.status);
      }
    }
  );
};
