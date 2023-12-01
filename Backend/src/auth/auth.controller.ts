import jwt from "jsonwebtoken";
import { AuthResponse, CreateUserInput, JwtPayload } from "../types/types";
import AuthDAO from "./auth.dao";
import ResponseGenerator from "../util/responseGenerator";
import { ESNUser } from "../user/user.entity";
import {
  ErrorMessage,
  UnauthorizedException,
  NotFoundException,
} from "../util/exception";

export default class AuthController {
  private authDao: AuthDAO;

  constructor() {
    this.authDao = new AuthDAO();
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

    const isUsernameValid: boolean = username.length >= 3;
    const isPasswordValid: boolean = password.length >= 4;

    return isUsernameValid && isPasswordValid;
  }

  /**
   * Generate a AuthResponse by providing id and username
   *
   * @param id user id that is used to generate a token
   * @param username username that is used to generate a token
   * @return The generated AuthResponse based on id and username
   */
  private static generateTokenResponse(
    id: number,
    username: string,
    role: string
  ): AuthResponse {
    const token: string = jwt.sign(
      { id: id, username: username, role: role },
      "esn",
      {
        expiresIn: "1h",
      }
    );

    return ResponseGenerator.authResponse(
      id.toString(),
      username.toLowerCase(),
      token
    );
  }

  /**
   * After validating and performing duplication check, create a new user
   *
   * @param userInput User input that is used to create the user
   * @return a AuthResponse message that shows the current request status
   * @throws UnauthorizedException if user input is illegal
   */
  async createUser(
    userInput: CreateUserInput,
    isAdmin?: boolean
  ): Promise<AuthResponse> {
    // If the user input is legal
    if (AuthController.isValidCredential(userInput)) {
      userInput.username = userInput.username.toLowerCase();
      const createdUser: ESNUser = await this.authDao.createUser(
        userInput,
        isAdmin
      );
      return AuthController.generateTokenResponse(
        createdUser.id,
        createdUser.username.toLowerCase(),
        createdUser.role
      );
    }

    // If user is not created
    throw new UnauthorizedException(ErrorMessage.ILLEGAL_CREDENTIAL_MESSAGE);
  }

  /**
   * Check if the user is authenticated to login
   *
   * @param userInput User input that is used to create the user
   * @returns a AuthResponse message that shows the current request status
   * @throws UnauthorizedException if password does not match
   * @throws NotFoundException if user does not exist
   */
  async loginUser(userInput: CreateUserInput): Promise<AuthResponse> {
    const user: ESNUser | null = await this.authDao.getUser(userInput.username);
    if (user) {
      // User exists, check password
      if (!user.isActivated) {
        throw new UnauthorizedException(
          ErrorMessage.UNAUTHORIZED_ACCESS_MESSAGE
        );
      }

      if (user.password === userInput.password) {
        return AuthController.generateTokenResponse(
          user.id,
          user.username,
          user.role
        );
      } else {
        throw new UnauthorizedException(ErrorMessage.WRONG_CREDENTIAL_MESSAGE);
      }
    }
    throw new NotFoundException(ErrorMessage.ACCOUNT_NOT_EXIST_MESSAGE);
  }

  async getUserRoleFromToken(token: string): Promise<string> {
    const decodedUser = jwt.verify(token, "esn") as JwtPayload;
    return decodedUser.role;
  }

  async getUsernameFromToken(token: string): Promise<string> {
    const decodedUser = jwt.verify(token, "esn") as JwtPayload;
    return decodedUser.username;
  }
}
