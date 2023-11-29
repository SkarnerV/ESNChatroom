import request from "supertest";
import bodyParser from "body-parser";
import express, { Express, Router } from "express";
import ESNDatabase from "../../src/database/ESNDatabase";
import UserRouter from "../../src/user/user.router";
import { ESNUser } from "../../src/user/user.entity";
import AuthController from "../../src/auth/auth.controller";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let userRouter: Router;
let app: Express;
let authController: AuthController;

const defaultESNUser = {
  id: null,
  username: "",
  password: "",
  lastStatus: "UNDEFINE",
  isOnline: false,
  lastTimeUpdateStatus: new Date(),
  lastOnlineTime: new Date().getTime().toString(),
};

const testESNUser1: ESNUser = {
  ...defaultESNUser,
  id: 1,
  username: "test_username1",
  password: "test_password1",
};

const testESNUser2: ESNUser = {
  ...defaultESNUser,
  id: 2,
  username: "test_username2",
  password: "test_password2",
};

beforeEach(async () => {
  app = express();
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  app.use(bodyParser.json());
  userRouter = new UserRouter().getRouter();
  authController = new AuthController();
  app.use("/api/users", userRouter);
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("UserRouter", () => {
  describe("GET /status", () => {
    it("should get all users status", async () => {
      await authController.createUser(testESNUser1);
      await authController.createUser(testESNUser2);
      const res = await request(app)
        .get("/api/users/status")
        .send()
        .expect(200);

      expect(res.body).toEqual([
        { lastStatus: "UNDEFINE", username: "test_username1" },
        { lastStatus: "UNDEFINE", username: "test_username2" },
      ]);
    });
  });
  describe("GET /:username/status", () => {
    it("should get specific user status", async () => {
      await authController.createUser(testESNUser1);
      let username = testESNUser1.username;
      const res = await request(app)
        .get(`/api/users/${username}/status`)
        .expect(200);

      expect(res.body).toEqual({ lastStatus: "UNDEFINE" });
    });
  });
  describe("PUT /status", () => {
    it("should update specific user status", async () => {
      await authController.createUser(testESNUser1);
      const requestBody = {
        username: testESNUser1.username,
        lastStatus: "YELLOW",
      };
      const res = await request(app)
        .put("/api/users/status")
        .send(requestBody)
        .expect(200);

      expect(res.body.lastStatus).toBe("YELLOW");

      // verify with GET
      const res1 = await request(app)
        .get("/api/users/status")
        .send()
        .expect(200);

      expect(res1.body).toEqual([
        { lastStatus: "YELLOW", username: "test_username1" },
      ]);
    });
  });
});
