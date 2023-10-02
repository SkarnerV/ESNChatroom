import { LoginAuthentication } from "../types/types";
import ESNDatabase from "../database/ESNDatabase";
import { ESNUser } from "../user/user.entity";
import { Repository } from "typeorm";

export default class AuthCollection {
  private userDatabase: Repository<ESNUser>;
  constructor() {
    this.userDatabase = ESNDatabase.getDatabaseInstance()
      .getDataSource()
      .getRepository(ESNUser);
  }

  // Create user and store in the DB
  async createUser(esnUser: ESNUser): Promise<string> {
    const user = this.userDatabase.create();
    user.username = esnUser.username;
    user.password = esnUser.password;

    //In RestApi spreadsheet, the user should have a default status as GREEN
    user.lastStatus = "GREEN";

    const createdUser = await this.userDatabase.save(user);
    return createdUser.id.toString();
  }

  // Get user ID from the DB
  async getUserId(username: string): Promise<string> {
    const user = await this.userDatabase.findOneBy({ username: username });
    if (!user) {
      return "";
    }
    return user.id.toString();
  }

  // Check if user exists and password is correct
  async checkUserLogin(
    username: string,
    password: string
  ): Promise<LoginAuthentication> {
    const user = await this.userDatabase.findOneBy({ username: username });
    if (user && user.password) {
      // User exists, check password
      const isPasswordMatch = password === user.password;
      return { userExists: true, passwordMatch: isPasswordMatch };
    } else {
      // User does not exist
      return { userExists: false, passwordMatch: false };
    }
  }

  // Update user online status
  async updateUserOnlineStatus(
    username: string,
    isOnline: boolean
  ): Promise<void> {
    const user = await this.userDatabase.findOneBy({ username: username });
    if (user) {
      user.is_online = isOnline;
      await this.userDatabase.save(user);
    }
  }
}
