import { Repository } from "typeorm";
import { ESNUser } from "./user.entity";
import ESNDatabase from "../database/ESNDatabase";
import { notFoundException } from "../util/exceptionHandler";

export default class UserDao {
  private ESNUserDatabase: Repository<ESNUser>;

  constructor() {
    this.ESNUserDatabase = ESNDatabase.getDatabaseInstance()
      .getDataSource()
      .getRepository(ESNUser);
  }

  async updateESNUserStatus(
    ESNUser: ESNUser,
    lastStatus: string
  ): Promise<ESNUser> {
    const userToUpdate = await this.ESNUserDatabase.findOneBy({
      id: ESNUser.id,
    });
    if (userToUpdate) {
      // Update user properties
      userToUpdate.lastStatus = lastStatus;

      // Save the updated user
      await this.ESNUserDatabase.save(userToUpdate);

      return userToUpdate;
    }
    throw new notFoundException("User not exist");
  }

  async getAllESNUserStatus(): Promise<ESNUser[]> {
    const allUsers = await this.ESNUserDatabase.find({
      select: ["username", "lastStatus", "isOnline"],
    });
    return allUsers;
  }

  async updateUserOnlineStatus(
    username: string,
    isOnline: boolean
  ): Promise<ESNUser> {
    const userToUpdate = await this.ESNUserDatabase.findOneBy({
      username
    });
    if (userToUpdate) {
      // Update user properties
      userToUpdate.isOnline = isOnline;

      // Save the updated user
      await this.ESNUserDatabase.save(userToUpdate);

      return userToUpdate;
    }
    throw new notFoundException("User not exist");
  }
}
