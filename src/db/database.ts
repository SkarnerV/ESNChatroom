import mongoose, { ConnectOptions } from "mongoose";

class Database {
  private static instance: Database;
  private mongoDB: any;

  constructor() {
    mongoose.connect(
      "mongodb+srv://sb1:u3PjrHNCr5gTKasH@esn.pwj9fb8.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );

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
