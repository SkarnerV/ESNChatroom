import request from "supertest";
import bodyParser from "body-parser";
import express, { Express, Router } from "express";
import ESNDatabase from "../../src/database/ESNDatabase";
import AuthRouter from "../../src/auth/auth.router";
import { ESNUser } from "../../src/user/user.entity";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let authRouter: Router;
let app: Express;

const defaultESNUser = {
  id: null,
  username: "",
  password: "",
  lastStatus: "GREEN",
  isOnline: false,
  lastTimeUpdateStatus: new Date(),
  lastOnlineTime: new Date().getTime().toString(),
};

beforeEach(async () => {
  app = express();
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  app.use(bodyParser.json());
  authRouter = new AuthRouter().getRouter();
  app.use("/api/users", authRouter);
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("AuthRouter", () => {
  describe("POST /register", () => {
    it("should register a user", async () => {
      const testESNUser: ESNUser = {
        ...defaultESNUser,
        id: 1,
        username: "test_username",
        password: "test_password",
      };

      const res = await request(app)
        .post("/api/users/register")
        .send(testESNUser)
        .expect(200);

      expect(res.body.status).toBe(201);
      expect(res.body.message).toBe("Account Created Successfully!");
    });
  });

  describe("POST /login", () => {
    it("should login a user", async () => {
      const testESNUser: ESNUser = {
        ...defaultESNUser,
        id: 1,
        username: "test_login",
        password: "test_password",
      };
      await request(app).post("/api/users/register").send(testESNUser);
      const res = await request(app)
        .post("/api/users/login")
        .send(testESNUser)
        .expect(200);

      expect(res.body.message).toBe("User Logined");
    });

    it("should fail login due to incorrect password", async () => {
      const testESNUser: ESNUser = {
        ...defaultESNUser,
        id: 1,
        username: "test_login",
        password: "test_password",
      };

      await request(app).post("/api/users/register").send(testESNUser);
      testESNUser.password = "wrong_password";
      const res = await request(app)
        .post("/api/users/login")
        .send(testESNUser)
        .expect(200);

      expect(res.body.status).toBe(401);
      expect(res.body.message).toBe("Re-enter the username and/or password");
    });
  });
});
