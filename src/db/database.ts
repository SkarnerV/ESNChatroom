import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

class Database {
  private static instance: Database;
  private mongoDB: any;

  constructor() {
    const mongodbKey = process.env.MONGODB_KEY || "";
    mongoose.connect(mongodbKey, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    this.mongoDB = mongoose;
  }

  public static getInstance(): Database {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }

  public getDB(): any {
    return this.mongoDB;
  }

  public async closeDB(): Promise<void> {
    await mongoose.connection.close();
  }
}

export default Database;
