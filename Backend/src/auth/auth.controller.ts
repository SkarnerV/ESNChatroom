import jwt from "jsonwebtoken";
import {
  LoginCredentials,
  LoginAuthentication,
  CreateUserInput,
} from "../types/types";
import AuthDAO from "./auth.dao";
import ResponseGenerator from "../util/responseGenerator";
import { ESNUser } from "../user/user.entity";
import reservedUsernames from "../constant/reservedUsernames";

export default class AuthController {
  private authDao: AuthDAO;

  constructor() {
    this.authDao = new AuthDAO();
  }

  /**
   * generate a token for user id
   *
   * @param id user id that is used to generate a token
   * @return the generated token
   */
  private static createUserToken(
    id: string,
    username: string,
    lastOnlineTime?: string
  ): string {
    return jwt.sign(
      { id: id, username: username, lastOnlineTime: lastOnlineTime },
      "esn",
      { expiresIn: "1h" }
    );
  }

  /**
   * Validates the userInput information
   *
   * @param userInput The validated userInput information
   * @return False if the userInput is illegal
   *         True if the userInput is legal
   */
  private static isValidCredential(userInput: CreateUserInput): boolean {
    const { username, password } = userInput;
    const notNullUser = username != null && password != null;
    const isUsernameValid: boolean =
      username !== "" &&
      username.length >= 3 &&
      !reservedUsernames.includes(username);
    const isPasswordValid: boolean = password !== "" && password.length >= 4;

    return notNullUser && isUsernameValid && isPasswordValid;
  }

  /**
   * After validating and performing duplication check, create a new user
   *
   * @param user The user that will be created
   * @return a LoginCrednetials message that shows the current request status
   */
  async createUser(userInput: CreateUserInput): Promise<LoginCredentials> {
    if (AuthController.isValidCredential(userInput)) {
      const createdUserID: string = await this.authDao.createUser(userInput);

      const token: string = AuthController.createUserToken(
        createdUserID,
        userInput.username.toLowerCase()
      );

      return ResponseGenerator.getLoginResponse(
        201,
        "Account Created Successfully!",
        token
      );
    }
    return ResponseGenerator.getLoginResponse(
      400,
      "Username and Password are required"
    );
  }

  /**
   * Check if the user is authenticated to login
   *
   * @param userInput The user that is trying to login
   * @returns a LoginCrednetials message that shows the current request status
   */
  async loginUser(userInput: CreateUserInput): Promise<LoginCredentials> {
    const isExistingUser: LoginAuthentication =
      await this.authDao.checkUserLogin(userInput.username, userInput.password);

    // If both conditions are true, it generates a token and returns a successful login response.
    if (isExistingUser.userExists && isExistingUser.passwordMatch) {
      const esnUser = await this.authDao.getUser(userInput.username);

      if (esnUser) {
        const token: string = AuthController.createUserToken(
          esnUser.id.toString(),
          esnUser.username,
          esnUser.lastOnlineTime
        );
        return ResponseGenerator.getLoginResponse(200, "User Logined", token);
      }
    } else if (isExistingUser.userExists && !isExistingUser.passwordMatch) {
      return ResponseGenerator.getLoginResponse(
        401,
        "Re-enter the username and/or password"
      );
    }
    return Promise.resolve(
      ResponseGenerator.getLoginResponse(400, "Account does not exits")
    );
  }
}
