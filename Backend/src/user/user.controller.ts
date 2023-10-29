import {
  BadRequestException,
  ErrorMessage,
  NotFoundException,
} from "../util/exception";
import UserDAO from "./user.dao";
import { ESNUser } from "./user.entity";
import { SocketServer } from "../server/socketServer";
import { UserStatus } from "./userStatus";

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
}
