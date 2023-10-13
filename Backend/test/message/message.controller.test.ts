import ESNDatabase from "../../src/database/ESNDatabase";
import MessageController from "../../src/message/message.controller";
import MessageDAO from "../../src/message/message.dao";
import { PublicMessage } from "../../src/message/publicMessage.entity";
import { Exception, statusCode } from "../../src/util/exceptionHandler";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let messageController: MessageController;
const testMessage1: PublicMessage = {
  id: 1,
  content: "this is a test mesage1 ",
  time: "12:11 PM",
  sender: "test1",
  senderStatus: "GREEN",
};

const testMessage2: PublicMessage = {
  id: 2,
  content: "this is a test mesage1 ",
  time: "12:11 PM",
  sender: "test1",
  senderStatus: "GREEN",
};

const testMessage3: PublicMessage = {
  id: 3,
  content: "this is a test mesage1 ",
  time: "12:11 PM",
  sender: "test1",
  senderStatus: "GREEN",
};

const testBadMessage1: PublicMessage = {
  id: 2,
  content: "this is a bad mesage2 ",
  time: "",
  sender: "test2",
  senderStatus: "GREEN",
};

const testBadMessage2: PublicMessage = {
  id: 2,
  content: "this is a bad mesage2 ",
  time: "12:33PM",
  sender: "",
  senderStatus: "GREEN",
};

const testBadMessage3: PublicMessage = {
  id: 3,
  content: "this is a bad mesage3 ",
  time: "12:33PM",
  sender: "test3",
  senderStatus: "",
};

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  messageController = new MessageController();
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("postPublicMessage", () => {
  it("Should post a new message and gets the message returned.", async () => {
    const returnedMessage =
      await messageController.postPublicMessage(testMessage1);

    expect(returnedMessage).toEqual(testMessage1);
  });

  it("Should throw BadRequestException if time is not provided.", async () => {
    try {
      await messageController.postPublicMessage(testBadMessage1);
    } catch (error) {
      expect((error as Exception).status).toEqual(statusCode.BAD_REQUEST_CODE);
    }
  });

  it("Should throw BadRequestException if sender is not provided.", async () => {
    try {
      await messageController.postPublicMessage(testBadMessage2);
    } catch (error) {
      expect((error as Exception).status).toEqual(statusCode.BAD_REQUEST_CODE);
    }
  });

  it("Should throw BadRequestException if sender status is not provided.", async () => {
    try {
      await messageController.postPublicMessage(testBadMessage3);
    } catch (error) {
      expect((error as Exception).status).toEqual(statusCode.BAD_REQUEST_CODE);
    }
  });
});

describe("getAllPublicMessage", () => {
  it("Should get empty messages if no message exits in database.", async () => {
    const returnedMessages = await messageController.getAllPublicMessage();

    expect(returnedMessages).toEqual([]);
  });
  it("Should get all messages in the database.", async () => {
    await messageController.postPublicMessage(testMessage1);
    await messageController.postPublicMessage(testMessage2);
    await messageController.postPublicMessage(testMessage3);
    const returnedMessages = await messageController.getAllPublicMessage();

    expect(returnedMessages).toEqual([
      testMessage1,
      testMessage2,
      testMessage3,
    ]);
  });
});
