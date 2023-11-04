import SearchController from "../../src/search/search.controller";
import ESNDatabase from "../../src/database/ESNDatabase";
import { Message } from "../../src/message/message.entity";
import MessageController from "../../src/message/message.controller";
import AuthController from "../../src/auth/auth.controller";
import { UserStatus } from "../../src/user/userStatus";
import { ESNUser } from "../../src/user/user.entity";
import SearchRouter from "../../src/search/search.router";
import request from "supertest";
import bodyParser from "body-parser";
import express, { Express, Router } from "express";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let searchController: SearchController;
let searchRouter: Router;
let messageController: MessageController;
let authController: AuthController;
let app: Express;

const defaultESNUser = {
  id: null,
  username: "",
  password: "",
  lastStatus: UserStatus.GREEN,
  lastTimeUpdateStatus: new Date(),
  lastOnlineTime: new Date().getTime().toString(),
};

const testUser1: ESNUser = {
  ...defaultESNUser,
  id: 1,
  username: "aaa1",
  password: "1234",
};

const testMessage1: Message = {
  id: 1,
  content: "this is a test message1 ",
  time: "12:11 PM",
  sender: "1",
  sendee: "Lobby",
  senderStatus: "GREEN",
};

const testMessage2: Message = {
  id: 2,
  content: "this is a test message2 ",
  time: "12:11 PM",
  sender: "1",
  sendee: "Lobby",
  senderStatus: "GREEN",
};

const testMessage3: Message = {
  id: 3,
  content: "this is a test message3 ",
  time: "12:11 PM",
  sender: "1",
  sendee: "2",
  senderStatus: "YELLOW",
};

const testMessage4: Message = {
  id: 4,
  content: "this is a test Announcement ",
  time: "12:11 PM",
  sender: "1",
  sendee: "Announcement",
  senderStatus: "GREEN",
};

beforeEach(async () => {
  app = express();
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  searchController = new SearchController();
  authController = new AuthController();
  messageController = new MessageController();
  searchRouter = new SearchRouter().getRouter();
  await messageController.postMessage(testMessage1);
  await messageController.postMessage(testMessage2);
  await messageController.postMessage(testMessage3);
  await messageController.postMessage(testMessage4);
  await authController.createUser(testUser1);
  app.use("/api/search", searchRouter);
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("SearchRouter", () => {
  describe("GET /:context", () => {
    it("should get all users", async () => {
      const res = await request(app)
        .get("/api/search/citizens?criteria=aaa1")
        .send()
        .expect(200);
      expect(res.body).toEqual([{ username: "aaa1", lastStatus: "GREEN" }]);
    });

    it("should get all messages", async () => {
      const res = await request(app)
        .get("/api/search/messages?criteria=message&sender=1&sendee=Lobby")
        .send()
        .expect(200);

      expect(res.body[0].id).toEqual(2);
      expect(res.body[1].id).toEqual(1);
    });

    it("should get all Announcement", async () => {
      const res = await request(app)
        .get(
          "/api/search/announcements?criteria=Announcement&sender=1&sendee=Announcement"
        )
        .send()
        .expect(200);
      expect(res.body[0].id).toEqual(4);
    });
  });
});
