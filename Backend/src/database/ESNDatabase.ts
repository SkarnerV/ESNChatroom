import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { ESNUser } from "../user/user";

dotenv.config();

export default class ESNDatabase {
  private database: DataSource;
  private static instance: ESNDatabase;

  private static prodDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 8675,
    username: "team-sb1",
    password: "sb1",
    database: "sb1",
    entities: [ESNUser],
    dropSchema: true,
    logging: true,
    synchronize: true,
  });

  private static testDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    entities: [ESNUser],
    dropSchema: true,
    logging: true,
    synchronize: true,
  });

  private constructor() {
    this.database = ESNDatabase.prodDataSource;
  }

  async initializeDatabase(): Promise<void> {
    await this.database.initialize();
  }

  setTestDatabase(): void {
    this.database = ESNDatabase.testDataSource;
  }

  setProdDatabase(): void {
    this.database = ESNDatabase.prodDataSource;
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
