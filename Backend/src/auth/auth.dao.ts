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
  async createUser(userInput: CreateUserInput): Promise<ESNUser> {
    const newUser = this.userDatabase.create();
    newUser.username = userInput.username;
    newUser.password = userInput.password;

    //In RestApi spreadsheet, the user should have a default status as UNDEFINE
    newUser.lastStatus = "UNDEFINE";
    newUser.lastTimeUpdateStatus = new Date();
    newUser.lastOnlineTime = new Date().getTime().toString();

    const createdUser = await this.userDatabase.save(newUser);
    return createdUser;
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
}
