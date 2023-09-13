import mongoose, { ConnectOptions } from "mongoose";

class db {
  private static instance: db;
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

  public static getInstance(): db {
    if (!this.instance) {
      this.instance = new db();
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

export default db;
