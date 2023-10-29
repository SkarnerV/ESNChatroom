import {
  loginApi,
  AllUserApi,
  registerApi,
  getAllUserStatusApi,
} from "./routes";
import { fetchRequest } from "./util";

export const userLogin = async (username: string, hashedPassword: string) => {
  return await fetchRequest(loginApi, "POST", {
    username,
    password: hashedPassword,
  }).then((response) => {
    return response.json();
  });
};

export const getUserStatusByUsername = async (username: string) => {
  return await fetchRequest(AllUserApi + `/${username}/status`, "GET").then(
    async (response) => {
      return await response.json();
    }
  );
};

export const updateLastStatus = async (
  username: string,
  lastStatus: string
) => {
  return await fetchRequest(getAllUserStatusApi, "PUT", {
    username: username,
    lastStatus: lastStatus,
  }).then((response) => {
    return response.json();
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
    return response.json();
  });
};

export const getAllUserStatus = async () => {
  return await fetchRequest(getAllUserStatusApi, "GET").then((response) => {
    return response.json();
  });
};
