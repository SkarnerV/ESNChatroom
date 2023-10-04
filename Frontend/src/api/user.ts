import { loginApi, registerApi, getAllUserStatusApi, putUserOnlineStatusApi} from "./routes";
import { fetchRequest } from "./util";

export const userLogin = async (username: string, hashedPassword: string) => {
  return await fetchRequest(loginApi, "POST", {
    username,
    password: hashedPassword,
  }).then((response) => {
    if (response.ok) {
      // Successful response (status code 200-299)
      return response.json();
    } else {
      // Handle error response
      throw new Error("HTTP error: " + response.status);
    }
  });
};

export const updateOnlineStatus = async (username: string, isOnline: string) => {
  return await fetchRequest(putUserOnlineStatusApi, "PUT",{
    username, isOnline
  }).then((response) => {
    if (response.ok) {
      // Successful response (status code 200-299)
      return response.json();
    } else {
      // Handle error response
      throw new Error("HTTP error: " + response.status);
    }
  });
}

export const userRegister = async (
  username: string,
  hashedPassword: string
) => {
  return await fetchRequest(registerApi, "POST", {
    username,
    password: hashedPassword,
  }).then((response) => {
    if (response.ok) {
      // Successful response (status code 200-299)
      return response.json();
    } else {
      // Handle error response
      throw new Error("HTTP error:" + response.status);
    }
  });
};

export const getAllUserStatus = async () => {
  return await fetchRequest(getAllUserStatusApi, "GET").then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("HTTP error: " + response.status);
    }
  });
};
