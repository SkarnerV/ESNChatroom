import ESNDatabase from "../../src/database/ESNDatabase";
import MessageDAO from "../../src/message/message.dao";
import { Message } from "../../src/message/message.entity";
import { PostMessageInput } from "../../src/types/types";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let messageDao: MessageDAO;
const testMessage1: Message = {
  id: 1,
  content: "this is a test message1 ",
  sender: "1",
  sendee: "2",
  time: "1",
  senderStatus: "GREEN",
};

const testMessage2: Message = {
  id: 2,
  content: "this is a test message2 ",
  sender: "1",
  sendee: "2",
  time: "3",
  senderStatus: "GREEN",
};

const testMessage3: Message = {
  id: 3,
  content: "message from 1 to Lobby1",
  sender: "1",
  sendee: "Lobby",
  time: "1",
  senderStatus: "GREEN",
};

const testMessage4: Message = {
  id: 4,
  content: "message from 1 to Lobby2",
  sender: "1",
  sendee: "Lobby",
  time: "1",
  senderStatus: "GREEN",
};

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  messageDao = new MessageDAO();
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("createMessage", () => {
  it("Should create a new message into the database", async () => {
    const createdMessage1 = await messageDao.createMessage(testMessage1);
    const createdMessage2 = await messageDao.createMessage(testMessage2);

    expect(createdMessage1.content).toEqual(testMessage1.content);

    expect(createdMessage2.content).toEqual(testMessage2.content);
  });
});

describe("getAllMessage", () => {
  it("Should return all the messages in the chat database", async () => {
    await messageDao.createMessage(testMessage1);
    await messageDao.createMessage(testMessage2);

    const allMessages = await messageDao.getAllMessages("1", "2");

    expect(allMessages.map((message) => message.content)).toEqual([
      testMessage1.content,
      testMessage2.content,
    ]);
  });
});

describe("getAllPublicMessages", () => {
  it("Should get all messages that send to Lobby", async () => {
    await messageDao.createMessage(testMessage3);
    await messageDao.createMessage(testMessage4);

    const allMessages = await messageDao.getAllPublicMessages("Lobby");

    expect(allMessages.map((message) => message.content)).toEqual([
      testMessage3.content,
      testMessage4.content,
    ]);
  });
});

describe("getUnreadMessages", () => {
  it("Should get no message if no message was sent after the last online time", async () => {
    await messageDao.createMessage(testMessage1);
    await messageDao.createMessage(testMessage2);
    const lastOnlineTime = "4";
    const allMessages = await messageDao.getUnreadMessages("2", lastOnlineTime);

    expect(allMessages.map((message) => message.content)).toEqual([]);
  });

  it("Should get no message if such user does not exist", async () => {
    const lastOnlineTime = new Date().getTime().toString();
    const allMessages = await messageDao.getUnreadMessages("9", lastOnlineTime);

    expect(allMessages.map((message) => message.content)).toEqual([]);
  });

  it("Should get all messages that send after the last online time", async () => {
    await messageDao.createMessage(testMessage1);
    const lastOnlineTime = "2";
    await messageDao.createMessage(testMessage2);
    const allMessages = await messageDao.getUnreadMessages("2", lastOnlineTime);

    expect(allMessages.map((message) => message.content)).toEqual([
      testMessage2.content,
    ]);
  });
});

describe("getLastPublicMessage", () => {
  it("Should get no message if no message was sent", async () => {
    const allMessages = await messageDao.getLastPublicMessage("2");
    expect(allMessages).toBe(null);
  });

  it("Should get last message from Lobby", async () => {
    await messageDao.createMessage(testMessage3);
    await messageDao.createMessage(testMessage4);

    const allMessages = await messageDao.getLastPublicMessage("Lobby");
    expect(allMessages).toEqual(testMessage4);
  });
});
