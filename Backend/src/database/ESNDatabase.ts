import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { ESNUser } from "../user/user.entity";
import { PublicMessage } from "../message/publicMessage.entity";

dotenv.config();

export default class ESNDatabase {
  private database: DataSource;
  private static instance: ESNDatabase;

  private static devDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 8675,
    username: "team-sb1",
    password: "sb1",
    database: "sb1",
    entities: [ESNUser, PublicMessage],
    dropSchema: true,
    logging: true,
    synchronize: true,
  });

  private static testDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    entities: [ESNUser, PublicMessage],
    dropSchema: true,
    logging: true,
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
