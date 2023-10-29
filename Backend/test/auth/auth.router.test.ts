import request from "supertest";
import bodyParser from "body-parser";
import express, { Express, Router } from "express";
import ESNDatabase from "../../src/database/ESNDatabase";
import AuthRouter from "../../src/auth/auth.router";
import { ESNUser } from "../../src/user/user.entity";
import { StatusCode } from "../../src/util/exception";

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
    it("Should register a user", async () => {
      const testESNUser: ESNUser = {
        ...defaultESNUser,
        id: 1,
        username: "test_username",
        password: "test_password",
      };

      const res = await request(app)
        .post("/api/users/register")
        .send(testESNUser)
        .expect(StatusCode.RESOURCE_CREATED_CODE);

      expect(res.body.username).toBe(testESNUser.username);
    });
  });

  describe("POST /login", () => {
    it("Should login a user", async () => {
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
        .expect(StatusCode.RESOURCE_CREATED_CODE);

      expect(res.body.username).toBe(testESNUser.username);
    });

    it("Should incurr 400 Error due to incorrect password", async () => {
      const testESNUser: ESNUser = {
        ...defaultESNUser,
        id: 1,
        username: "test_login",
        password: "test_password",
      };

      await request(app).post("/api/users/register").send(testESNUser);
      testESNUser.password = "wrong_password";
      await request(app)
        .post("/api/users/login")
        .send(testESNUser)
        .expect(StatusCode.UNAUTHORIZED_CODE);
    });

    it("Should incurr 404 Error due to user not exit", async () => {
      const testESNUser: ESNUser = {
        ...defaultESNUser,
        id: 1,
        username: "test_login",
        password: "test_password",
      };

      await request(app)
        .post("/api/users/login")
        .send(testESNUser)
        .expect(StatusCode.NOT_FOUND_CODE);
    });
  });
});
