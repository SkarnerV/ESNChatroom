import { DataSource } from "typeorm";
import { ESNUser } from "../user/user.entity";
import { Message } from "../message/message.entity";

export default class ESNDatabase {
  private database: DataSource;
  private static instance: ESNDatabase;

  private static devDataSource = new DataSource({
    type: "mysql",
    host: process.env.DBHOST || "localhost",
    port: Number(process.env.DBPORT) || 8675,
    username: "team-sb1",
    password: "sb1",
    database: "sb1",
    entities: [ESNUser, Message],
    dropSchema: process.env ? false : true,
    logging: true,
    synchronize: true,
  });

  private static testDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    entities: [ESNUser, Message],
    dropSchema: true,
    logging: false,
    synchronize: true,
  });

  private constructor() {
    this.database = ESNDatabase.devDataSource;
  }

  async initializeDatabase(): Promise<void> {
    await this.database.initialize();
  }

  setTestDatabase(): void {
    this.database = ESNDatabase.testDataSource;
  }

  setDevDatabase(): void {
    this.database = ESNDatabase.devDataSource;
  }

  static getDatabaseInstance(): ESNDatabase {
    if (!this.instance) {
      this.instance = new ESNDatabase();
    }

    return this.instance;
  }

  getDataSource(): DataSource {
    return this.database;
  }
}
