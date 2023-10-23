import {
  loginApi,
  AllUserApi,
  registerApi,
  getAllUserStatusApi,
  putUserOnlineStatusApi,
} from "./routes";
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

export const getUserStatusByUsername = async (username: string) => {
  return await fetchRequest(AllUserApi + `/${username}/status`, "GET").then(
    async (response) => {
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("HTTP error: " + response.status);
      }
    }
  );
};

export const updateOnlineStatus = async (username: string) => {
  return await fetchRequest(putUserOnlineStatusApi, "PUT", {
    username,
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

export const updateLastStatus = async (
  username: string,
  lastStatus: string
) => {
  return await fetchRequest(getAllUserStatusApi, "PUT", {
    username: username,
    lastStatus: lastStatus,
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
