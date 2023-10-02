import jwt from "jsonwebtoken";
import { LoginCredentials, LoginAuthentication } from "../types/types";
import UserCollection from "./auth.dao";
import ResponseGenerator from "../util/responseGenerator";
import { ESNUser } from "../user/user";

export default class UserController {
  private userCollection: UserCollection;

  constructor() {
    this.userCollection = new UserCollection();
  }

  /**
   * generate a token for user id
   *
   * @param id user id that is used to generate a token
   * @return the generated token
   */
  private static createUserToken(id: string, username: string): string {
    return jwt.sign({ id: id, username: username }, "esn", { expiresIn: "1h" });
  }

  /**
   * Validates the user information
   *
   * @param user The validated user information
   * @return False if the user provided is illegal
   *         True if the user provided is legal
   */
  private static isValidCredential(user: ESNUser): boolean {
    const { username, password } = user;

    const isUsernameValid: boolean = username !== "";
    const isPasswordValid: boolean = password !== "" && password?.length >= 4;

    return isUsernameValid && isPasswordValid;
  }

  /**
   * After validating and performing duplication check, create a new user
   *
   * @param user The user that will be created
   * @return a LoginCrednetials message that shows the current request status
   */
  async createUser(user: ESNUser): Promise<LoginCredentials> {
    if (UserController.isValidCredential(user)) {
      const createdUserID: string = await this.userCollection.createUser(user);

      const token: string = UserController.createUserToken(
        createdUserID,
        user.username
      );

      await this.userCollection.updateUserOnlineStatus(user.username, true);

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
   * @param user The user that is trying to login
   * @returns a LoginCrednetials message that shows the current request status
   */
  async loginUser(user: ESNUser): Promise<LoginCredentials> {
    const isExistingUser: LoginAuthentication =
      await this.userCollection.checkUserLogin(user.username, user.password);

    // If both conditions are true, it generates a token and returns a successful login response.
    if (isExistingUser.userExists && isExistingUser.passwordMatch) {
      const userId = await this.userCollection.getUserId(user.username);
      if (userId !== "") {
        const token: string = UserController.createUserToken(
          userId,
          user.username
        );
        await this.userCollection.updateUserOnlineStatus(user.username, true);
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

  /**
   * Logout the user
   *
   * @param user The user that is trying to logout
   * @returns a LoginCrednetials message that shows the current request status
   */
  async logoutUser(token: string): Promise<LoginCredentials> {
    try {
      const decodedToken = jwt.verify(token, "esn");
      const user = decodedToken as { id: string; username: string };
      await this.userCollection.updateUserOnlineStatus(user.username, false);
      return ResponseGenerator.getLoginResponse(200, "User Logouted");
    } catch (error) {
      return ResponseGenerator.getLoginResponse(400, "Account does not exits");
    }
  }
}
