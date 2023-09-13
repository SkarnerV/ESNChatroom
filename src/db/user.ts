import db from "./db";
import { Schema, Model } from "mongoose";

interface IUser {
  username: string;
  email: string;
}

class User {
  private userModel: Model<IUser>;

  constructor() {
    const userSchema = new Schema({
      username: String,
      email: String,
    });
    const my_db = db.getInstance().getDB();
    this.userModel = my_db.model("User", userSchema);
  }

  async createUser(username: string, email: string): Promise<IUser> {
    try {
      const user = new this.userModel({ username, email });
      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  public getUserDB(): Model<IUser> {
    return this.userModel;
  }
}

export default User;
