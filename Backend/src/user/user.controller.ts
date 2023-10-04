import UserDAO from "./user.dao";
import { ESNUser } from "./user.entity";

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
  async updateUserOnlineStatus(
    username: string,
    isOnline: string
  ): Promise<ESNUser> {
    let user: ESNUser = new ESNUser();

    await this.userDao
      .updateUserOnlineStatus(username, isOnline === "true" ? true : false)
      .then((response) => (user = response));

    return user;
  }
}
