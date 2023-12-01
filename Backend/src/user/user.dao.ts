import { In, Like, Repository } from "typeorm";
import { ESNUser } from "./user.entity";
import ESNDatabase from "../database/ESNDatabase";

export default class UserDAO {
  private ESNUserDatabase: Repository<ESNUser>;

  constructor() {
    this.ESNUserDatabase = ESNDatabase.getDatabaseInstance()
      .getDataSource()
      .getRepository(ESNUser);
  }

  async updateUserStatus(
    username: string,
    lastStatus?: string
  ): Promise<ESNUser | null> {
    const userToUpdate = await this.ESNUserDatabase.findOneBy({
      username,
    });
    if (userToUpdate) {
      // Update user properties
      if (lastStatus) {
        userToUpdate.lastStatus = lastStatus;
        userToUpdate.lastTimeUpdateStatus = new Date();
      } else {
        userToUpdate.lastOnlineTime = new Date().getTime().toString();
      }

      // Save the updated user
      await this.ESNUserDatabase.save(userToUpdate);
    }
    return userToUpdate;
  }

  async getAllActivatedUsername(): Promise<ESNUser[]> {
    const allUsers = await this.ESNUserDatabase.find({
      where: {
        isActivated: true,
      },
      select: ["username"],
    });
    return allUsers;
  }

  async getAllESNUserStatus(): Promise<ESNUser[]> {
    const allUsers = await this.ESNUserDatabase.find({
      select: ["username", "lastStatus"],
    });
    return allUsers;
  }

  async getUserByUsername(username: string): Promise<ESNUser | null> {
    return await this.ESNUserDatabase.findOneBy({
      username,
    });
  }

  async getUsersByUsernames(usernames: string[]): Promise<ESNUser[]> {
    const users: ESNUser[] = await this.ESNUserDatabase.find({
      where: {
        username: In(usernames),
      },
    });

    return users;
  }

  async getAllAdmin(): Promise<ESNUser[]> {
    const users: ESNUser[] = await this.ESNUserDatabase.find({
      where: {
        role: "admin",
      },
    });
    return users;
  }

  async getUsersByPartialUsername(username: string): Promise<ESNUser[]> {
    const users: ESNUser[] = await this.ESNUserDatabase.find({
      where: { username: Like(`%${username}%`) },
      select: ["username", "lastStatus"],
    });
    return users;
  }

  async getUsersByStatus(status: string): Promise<ESNUser[]> {
    const users: ESNUser[] = await this.ESNUserDatabase.find({
      where: { lastStatus: status },
      select: ["username", "lastStatus"],
    });
    return users;
  }

  async updateUserProfile(
    username: string,
    newUsername?: string,
    password?: string,
    role?: string,
    isActivated?: boolean
  ): Promise<ESNUser | null> {
    const userToUpdate = await this.ESNUserDatabase.findOneBy({
      username,
    });
    if (userToUpdate) {
      // Update user properties
      if (newUsername) {
        userToUpdate.username = newUsername.toLowerCase();
      }

      if (password) {
        userToUpdate.password = password;
      }
      if (role) {
        userToUpdate.role = role;
      }
      if (isActivated) {
        userToUpdate.isActivated = isActivated;
      }

      // Save the updated user
      await this.ESNUserDatabase.save(userToUpdate);
    }
    return userToUpdate;
  }
}
