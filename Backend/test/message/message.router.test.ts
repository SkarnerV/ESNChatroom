import request from "supertest";
import bodyParser from "body-parser";
import express, { Express, Router } from "express";
import ESNDatabase from "../../src/database/ESNDatabase";
import MessageRouter from "../../src/message/message.router";
import { Message } from "../../src/message/message.entity";
import { CreateUserInput, PostMessageInput } from "../../src/types/types";
import AuthController from "../../src/auth/auth.controller";
import MessageController from "../../src/message/message.controller";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let messageRouter: Router;
let app: Express;
let authController: AuthController;
let messageController: MessageController;

const testMessage1: Message = {
  id: 1,
  content: "this is a test message1",
  time: "12:11 PM",
  sender: "1",
  sendee: "Lobby",
  senderStatus: "GREEN",
};

const testMessage2: Message = {
  id: 2,
  content: "this is a test message2",
  time: "12:15 PM",
  sender: "1",
  sendee: "Lobby",
  senderStatus: "GREEN",
};

const testMessage3: Message = {
  id: 3,
  content: "this is a test message3",
  time: "12:20 PM",
  sender: "1",
  sendee: "2",
  senderStatus: "GREEN",
};

const testMessage4: PostMessageInput = {
  content: "this is a test message4",
  sender: "1",
  sendee: "aaa",
  senderStatus: "GREEN",
};

const testMessage5: PostMessageInput = {
  content: "this is a test message5",
  sender: "1",
  sendee: "aaa",
  senderStatus: "GREEN",
};

beforeEach(async () => {
  app = express();
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  app.use(bodyParser.json());
  authController = new AuthController();
  messageController = new MessageController();
  const exampleUserinput1: CreateUserInput = {
    username: "aaa",
    password: "aaaa",
  };
  await authController.createUser(exampleUserinput1);
  messageRouter = new MessageRouter().getRouter();
  app.use("/api/messages", messageRouter);
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("MessageRouter", () => {
  describe("POST /", () => {
    it("should post a message from sender to sendee", async () => {
      const res = await request(app)
        .post("/api/messages")
        .send(testMessage1)
        .expect(200);

      expect(res.body.sender).toEqual(testMessage1.sender);
      expect(res.body.sendee).toEqual(testMessage1.sendee);
      expect(res.body.content).toEqual(testMessage1.content);

      //verify with GET
      let user1 = testMessage1.sender;
      let user2 = testMessage1.sendee;
      const res1 = await request(app)
        .get(`/api/messages/${user1}/${user2}`)
        .send()
        .expect(200);
      expect(res1.body.map((message: Message) => message.content)).toEqual([
        testMessage1.content,
      ]);
    });
  });
  describe("GET /:sender/:sendee", () => {
    it("should get all messages from sender to sendee", async () => {
      await messageController.postMessage(testMessage1);
      await messageController.postMessage(testMessage2);
      await messageController.postMessage(testMessage3);

      let user1 = "1";
      let user2 = "2";
      let lobby = "Lobby";
      const res = await request(app)
        .get(`/api/messages/${user1}/${user2}`)
        .expect(200);

      expect(res.body.map((message: Message) => message.content)).toEqual([
        testMessage3.content,
      ]);
    });
  });
  describe("GET /:sendee", () => {
    it("should get all unreed messages for the sendee", async () => {
      await messageController.postMessage(testMessage4);
      await messageController.postMessage(testMessage5);

      let user = "aaa";

      const res = await request(app).get(`/api/messages/${user}`).expect(200);

      expect(res.body.map((message: Message) => message.content)).toEqual([
        testMessage4.content,
        testMessage5.content,
      ]);
    });
  });
});
