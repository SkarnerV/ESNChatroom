import {
  BadRequestException,
  ErrorMessage,
  NotFoundException,
} from "../util/exception";
import UserDAO from "./user.dao";
import { ESNUser } from "./user.entity";
import { SocketServer } from "../server/socketServer";
import { UserStatus } from "./userStatus";
import { UserAccountStatus } from "../types/types";
import { reservedUsernames } from "../constant/reservedUsernames";

export default class UserController {
  private userDao: UserDAO;
  constructor() {
    this.userDao = new UserDAO();
  }

  async getAllUserStatus(): Promise<ESNUser[]> {
    let allUsers: ESNUser[] = [];

    await this.userDao
      .getAllESNUserStatus()
      .then((response) => (allUsers = response));

    return allUsers;
  }

  async updateUserStatus(
    username: string,
    lastStatus?: UserStatus
  ): Promise<ESNUser | null> {
    // if (lastStatus && Object.values<string>(UserStatus).includes(lastStatus)) {
    //   throw new BadRequestException(ErrorMessage.UNKNOWN_USER_STATUS);
    // }
    let user = null;

    await this.userDao
      .updateUserStatus(username, lastStatus)
      .then((response: ESNUser | null) => {
        if (!response) {
          throw new NotFoundException(ErrorMessage.ACCOUNT_NOT_EXIST_MESSAGE);
        }
        user = response;
      });
    this.sendUserStatusChangeEvent(username, lastStatus);
    return user;
  }

  async getAllActivatedUsers(): Promise<string[]> {
    let allUsers: string[] = [];

    await this.userDao
      .getAllActivatedUsername()
      .then((response) => (allUsers = response.map((user) => user.username)));

    return allUsers;
  }

  private async sendUserStatusChangeEvent(
    username: string,
    lastStatus?: UserStatus
  ) {
    if (lastStatus) {
      const socketUserLastStatus: string[] = [username, lastStatus];
      await SocketServer.getInstance().broadcastChangedStatus(
        socketUserLastStatus
      );
    }
  }

  async getUserStatusByUsername(username: string): Promise<string> {
    let lastStatus: string = "";
    await this.userDao
      .getUserByUsername(username)
      .then((response: ESNUser | null) => {
        if (!response) {
          throw new NotFoundException(ErrorMessage.ACCOUNT_NOT_EXIST_MESSAGE);
        }
        lastStatus = response.lastStatus;
      });
    return lastStatus;
  }

  async getUserRoleByUsername(username: string): Promise<string> {
    let role: string = "";
    await this.userDao
      .getUserByUsername(username)
      .then((response: ESNUser | null) => {
        if (!response) {
          throw new NotFoundException(ErrorMessage.ACCOUNT_NOT_EXIST_MESSAGE);
        }
        role = response.role;
      });
    return role;
  }

  async verifyIsAdmin(registerUsername: string): Promise<void> {
    if ((await this.getUserRoleByUsername(registerUsername)) != "admin") {
      throw new BadRequestException(ErrorMessage.UNAUTHORIZED_ACCESS_MESSAGE);
    }
  }

  async verifyEligiblePassword(newPassword?: string): Promise<void> {
    if (newPassword != undefined && newPassword.length < 4) {
      throw new BadRequestException(ErrorMessage.ILLEGAL_CREDENTIAL_MESSAGE);
    }
  }

  async verifyNotDeletingLastAdmin(
    registerUsername: string,
    usernameToUpdate: string,
    roleToUpdate?: string,
    isActivated?: boolean
  ): Promise<void> {
    const allAdmins = await this.userDao.getAllAdmin();

    if (
      allAdmins.length == 1 &&
      usernameToUpdate == registerUsername &&
      allAdmins[0].username == registerUsername &&
      (roleToUpdate != undefined || isActivated != undefined)
    ) {
      throw new BadRequestException(
        ErrorMessage.MUST_HAVE_AT_LEAST_ONE_ADMIN_MESSAGE
      );
    }
  }

  async verifyEligibleUsername(newUsername?: string): Promise<void> {
    if (newUsername != undefined) {
      if (reservedUsernames.includes(newUsername)) {
        throw new BadRequestException(
          ErrorMessage.USERNAME_CANNOT_BE_RESERVED_WORDS
        );
      }
      const user = await this.userDao.getUserByUsername(
        newUsername.toLowerCase()
      );
      if (user) {
        throw new BadRequestException(ErrorMessage.USERNAME_EXIST_MESSAGE);
      }
    }
  }

  async updateUserProfile(
    registerUsername: string,
    username: string,
    newUsername?: string,
    newPassword?: string,
    role?: string,
    isActivated?: boolean
  ): Promise<ESNUser | null> {
    let userToUpdate = null;
    await this.verifyIsAdmin(registerUsername);
    await this.verifyEligiblePassword(newPassword);
    await this.verifyNotDeletingLastAdmin(
      registerUsername,
      username,
      role,
      isActivated
    );
    await this.verifyEligibleUsername(newUsername);

    await this.userDao
      .updateUserProfile(username, newUsername, newPassword, role, isActivated)
      .then((response: ESNUser | null) => {
        if (!response) {
          throw new NotFoundException(ErrorMessage.ACCOUNT_NOT_EXIST_MESSAGE);
        }
        userToUpdate = response;
      });

    if (isActivated != undefined) {
      this.sendUserAccountChangeEvent(username, isActivated);
    }

    return userToUpdate;
  }

  private async sendUserAccountChangeEvent(
    username: string,
    isActivated?: boolean
  ) {
    if (isActivated) {
      const socketUserAccountStatus: UserAccountStatus = {
        username: username,
        isActivated: isActivated,
      };
      await SocketServer.getInstance().broadcastChangedAccountStatus(
        socketUserAccountStatus
      );
    }
  }
}
