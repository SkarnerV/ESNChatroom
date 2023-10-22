import { notFoundException } from "../util/exceptionHandler";
import UserDAO from "./user.dao";
import { ESNUser } from "./user.entity";
import { SocketServer } from "../server/socketServer";

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
    lastStatus: string
  ): Promise<ESNUser> {
    let user: ESNUser | null = new ESNUser();
    const socketUserLastStatus: string[] = [username, lastStatus];
    await this.userDao
      .updateESNUserStatus(username, lastStatus)
      .then((response) => (user = response));
    if (!user) {
      throw new notFoundException("User not exists!");
    }
    await SocketServer.getInstance().broadcastChangedStatus(
      socketUserLastStatus
    );
    return user;
  }

  async getUserStatusByUsername(username: string): Promise<string> {
    let status: string | null = "";

    await this.userDao
      .getUserStatus(username)
      .then((response) => (status = response));
    if (!status) {
      throw new notFoundException("User not exists!");
    }
    return status;
  }

  async updateUserOnlineStatus(
    username: string,
    isOnline: string
  ): Promise<ESNUser> {
    let user: ESNUser | null = new ESNUser();

    await this.userDao
      .updateUserOnlineStatus(username, isOnline === "true" ? true : false)
      .then((response) => (user = response));

    if (!user) {
      throw new notFoundException("User not exists!");
    }

    return user;
  }
}
