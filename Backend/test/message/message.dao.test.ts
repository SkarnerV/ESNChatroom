import ESNDatabase from "../../src/database/ESNDatabase";
import MessageDAO from "../../src/message/message.dao";
import { PublicMessage } from "../../src/message/publicMessage.entity";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let messageDao: MessageDAO;
const testMessage1: PublicMessage = {
  id: 1,
  content: "this is a test mesage1 ",
  time: "12:11 PM",
  sender: "test1",
};

const testMessage2: PublicMessage = {
  id: 2,
  content: "this is a test mesage2 ",
  time: "12:22PM",
  sender: "test2",
};

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  messageDao = new MessageDAO();
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("createPublicMessage", () => {
  it("Should create a new message into the database", async () => {
    const createdMessage1 = await messageDao.createPublicMessage(testMessage1);
    const createdMessage2 = await messageDao.createPublicMessage(testMessage2);

    expect(createdMessage1).not.toBeNull();
    expect(createdMessage1).toEqual(testMessage1);
    expect(createdMessage2).not.toBeNull();
    expect(createdMessage2).toEqual(testMessage2);
  });
});

describe("getAllPublicMessage", () => {
  it("Should return all the messages in the public chat database", async () => {
    await messageDao.createPublicMessage(testMessage1);
    await messageDao.createPublicMessage(testMessage2);

    const allMessages = await messageDao.getAllPublicMessage();

    expect(allMessages).not.toBeNull();
    expect(allMessages).toEqual([testMessage1, testMessage2]);
  });
});
