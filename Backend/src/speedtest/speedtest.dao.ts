import { Repository } from "typeorm";
import { Message } from "../message/message.entity";
import ESNDatabase from "../database/ESNDatabase";

export default class SpeedTestDAO {
  async enterTestMode(): Promise<string> {
    const databaseInstance = ESNDatabase.getDatabaseInstance();
    databaseInstance.setTestDatabase();
    await databaseInstance.getDataSource().initialize();
    console.log("Testing Database initialized");
    return "Entered Testing Mode";
  }

  async endTestMode(): Promise<string> {
    await ESNDatabase.getDatabaseInstance().getDataSource().destroy();
    console.log("Testing Database Destroyed");
    return "Exit Testing Mode";
  }
}