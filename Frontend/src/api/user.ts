import { loginApi, registerApi } from "./routes";
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
