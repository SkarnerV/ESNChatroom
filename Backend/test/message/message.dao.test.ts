import ESNDatabase from "../../src/database/ESNDatabase";
import MessageDAO from "../../src/message/message.dao";
import { Message } from "../../src/message/message.entity";
import { PostMessageInput } from "../../src/types/types";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let messageDao: MessageDAO;
const testMessage1: PostMessageInput = {
  content: "this is a test mesage1 ",
  sender: "1",
  sendee: "2",
  senderStatus: "GREEN",
};

const testMessage2: PostMessageInput = {
  content: "this is a test mesage2 ",
  sender: "1",
  sendee: "2",
  senderStatus: "GREEN",
};

const testMessage3: PostMessageInput = {
  content: "message from 1 to Lobby",
  sender: "1",
  sendee: "Lobby",
  senderStatus: "GREEN",
};

const testMessage4: PostMessageInput = {
  content: "message from 1 to Lobby",
  sender: "1",
  sendee: "Lobby",
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
    const createdMessage1 = await messageDao.createMessage(testMessage1, "1");
    const createdMessage2 = await messageDao.createMessage(testMessage2, "1");

    expect(createdMessage1.content).toEqual(testMessage1.content);

    expect(createdMessage2.content).toEqual(testMessage2.content);
  });
});

describe("getAllMessage", () => {
  it("Should return all the messages in the chat database", async () => {
    await messageDao.createMessage(testMessage1, "1");
    await messageDao.createMessage(testMessage2, "1");

    const allMessages = await messageDao.getAllMessages("1", "2");

    expect(allMessages.map((message) => message.content)).toEqual([
      testMessage1.content,
      testMessage2.content,
    ]);
  });
});

describe("getAllPublicMessages", () => {
  it("Should get all messages that send to Lobby", async () => {
    await messageDao.createMessage(testMessage3, "1");
    await messageDao.createMessage(testMessage4, "1");

    const allMessages = await messageDao.getAllPublicMessages();

    expect(allMessages.map((message) => message.content)).toEqual([
      testMessage3.content,
      testMessage4.content,
    ]);
  });
});

describe("getUnreadMessages", () => {
  it("Should get no message if no message was sent after the last online time", async () => {
    await messageDao.createMessage(testMessage1, "123");
    await messageDao.createMessage(testMessage2, "125");
    const lastOnlineTime = "126";
    const allMessages = await messageDao.getUnreadMessages("2", lastOnlineTime);

    expect(allMessages.map((message) => message.content)).toEqual([]);
  });

  it("Should get no message if such user does not exist", async () => {
    const lastOnlineTime = "124";
    const allMessages = await messageDao.getUnreadMessages("9", lastOnlineTime);

    expect(allMessages.map((message) => message.content)).toEqual([]);
  });

  it("Should get all messages that send after the last online time", async () => {
    await messageDao.createMessage(testMessage1, "123");
    await messageDao.createMessage(testMessage2, "125");
    const lastOnlineTime = "124";
    const allMessages = await messageDao.getUnreadMessages("2", lastOnlineTime);

    expect(allMessages.map((message) => message.content)).toEqual([
      testMessage2.content,
    ]);
  });
});
