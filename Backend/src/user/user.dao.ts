import { Repository } from "typeorm";
import { ESNUser } from "./user.entity";
import ESNDatabase from "../database/ESNDatabase";

export default class UserDAO {
  private ESNUserDatabase: Repository<ESNUser>;

  constructor() {
    this.ESNUserDatabase = ESNDatabase.getDatabaseInstance()
      .getDataSource()
      .getRepository(ESNUser);
  }

  async updateESNUserStatus(
    username: string,
    lastStatus: string
  ): Promise<ESNUser | null> {
    const userToUpdate = await this.ESNUserDatabase.findOneBy({
      username,
    });
    if (userToUpdate) {
      // Update user properties
      userToUpdate.lastStatus = lastStatus;
      userToUpdate.lastTimeUpdateStatus = new Date();
      // Save the updated user
      await this.ESNUserDatabase.save(userToUpdate);

      return userToUpdate;
    }
    return null;
  }

  async getAllESNUserStatus(): Promise<ESNUser[]> {
    const allUsers = await this.ESNUserDatabase.find({
      select: ["username", "lastStatus"],
    });
    return allUsers;
  }

  async getUserStatus(username: string): Promise<string | null> {
    const user = await this.ESNUserDatabase.findOneBy({
      username,
    });
    if (user) {
      return user.lastStatus;
    }
    return null;
  }

  async updateUserOnlineStatus(username: string): Promise<ESNUser | null> {
    const userToUpdate = await this.ESNUserDatabase.findOneBy({
      username,
    });
    if (userToUpdate) {
      // Update user properties
      userToUpdate.lastOnlineTime = new Date().getTime().toString();
      // Save the updated user
      await this.ESNUserDatabase.save(userToUpdate);

      return userToUpdate;
    }
    return null;
  }

  async getUsersByUsernames(usernames: string[]): Promise<ESNUser[]> {
    const users: ESNUser[] = [];

    for (const username of usernames) {
      const user: ESNUser | null = await this.ESNUserDatabase.findOneBy({
        username: username,
      });
      if (user) {
        users.push(user);
      }
    }

    return users;
  }
}
