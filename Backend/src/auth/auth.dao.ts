import { CreateUserInput, LoginAuthentication } from "../types/types";
import ESNDatabase from "../database/ESNDatabase";
import { ESNUser } from "../user/user.entity";
import { Repository } from "typeorm";

export default class AuthDAO {
  private userDatabase: Repository<ESNUser>;
  constructor() {
    this.userDatabase = ESNDatabase.getDatabaseInstance()
      .getDataSource()
      .getRepository(ESNUser);
  }

  // Create user and store in the DB
  async createUser(userInput: CreateUserInput): Promise<string> {
    const newUser = this.userDatabase.create();
    newUser.username = userInput.username;
    newUser.password = userInput.password;

    //In RestApi spreadsheet, the user should have a default status as GREEN
    newUser.lastStatus = "GREEN";
    newUser.lastTimeUpdateStatus = new Date();
    newUser.lastOnlineTime = new Date().getTime().toString();

    const createdUser = await this.userDatabase.save(newUser);
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

  // Get user from the DB
  async getUser(username: string): Promise<ESNUser | null> {
    const user = await this.userDatabase.findOneBy({ username: username });
    if (!user) {
      return null;
    }
    return user;
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
}
