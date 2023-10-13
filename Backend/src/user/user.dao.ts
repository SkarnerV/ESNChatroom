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
      select: ["username", "lastStatus", "isOnline"],
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

  async updateUserOnlineStatus(
    username: string,
    isOnline: boolean
  ): Promise<ESNUser | null> {
    const userToUpdate = await this.ESNUserDatabase.findOneBy({
      username,
    });
    if (userToUpdate) {
      // Update user properties
      userToUpdate.isOnline = isOnline;
      // Save the updated user
      await this.ESNUserDatabase.save(userToUpdate);

      return userToUpdate;
    }
    return null;
  }
}
