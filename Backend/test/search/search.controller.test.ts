import SearchController from "../../src/search/search.controller";
import ESNDatabase from "../../src/database/ESNDatabase";
import { Message } from "../../src/message/message.entity";
import MessageController from "../../src/message/message.controller";
import AuthController from "../../src/auth/auth.controller";
import { Exception, StatusCode } from "../../src/util/exception";
import { UserStatus } from "../../src/user/userStatus";
import { ESNUser } from "../../src/user/user.entity";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let searchController: SearchController;
let messageController: MessageController;
let authController: AuthController;

const defaultESNUser = {
  id: null,
  username: "",
  password: "",
  lastStatus: UserStatus.UNDEFINE,
  lastTimeUpdateStatus: new Date(),
  lastOnlineTime: new Date().getTime().toString(),
  isActivated: true,
  role: "citizen",
};

const testUser1: ESNUser = {
  ...defaultESNUser,
  id: 1,
  username: "aaa1",
  password: "1234",
};

const testUser2: ESNUser = {
  ...defaultESNUser,
  id: 2,
  username: "aaa2",
  password: "1234",
};

const testUser3: ESNUser = {
  ...defaultESNUser,
  id: 3,
  username: "aaa2",
  password: "1234",
};

const testUser4: ESNUser = {
  ...defaultESNUser,
  id: 4,
  username: "aaa4",
  password: "1234",
};

const testMessage1: Message = {
  id: 1,
  content: "this is a test message1 ",
  time: "12:11 PM",
  sender: "aaa1",
  sendee: "Lobby",
  senderStatus: "GREEN",
};

const testMessage2: Message = {
  id: 2,
  content: "this is a test message2 ",
  time: "12:11 PM",
  sender: "aaa1",
  sendee: "aaa2",
  senderStatus: "YELLOW",
};

const testMessage3: Message = {
  id: 3,
  content: "This is a test message3 ",
  time: "12:22 PM",
  sender: "aaa1",
  sendee: "Lobby",
  senderStatus: "GREEN",
};

const testMessage4: Message = {
  id: 4,
  content: "this is a test message4 ",
  time: "12:11 PM",
  sender: "aaa1",
  sendee: "aaa2",
  senderStatus: "GREEN",
};

const testMessage5: Message = {
  id: 5,
  content: "this is a test message5 ",
  time: "12:11 PM",
  sender: "aaa1",
  sendee: "3",
  senderStatus: "GREEN",
};

const testMessage6: Message = {
  id: 6,
  content: "this is a test Announcement ",
  time: "12:11 PM",
  sender: "aaa1",
  sendee: "Announcement",
  senderStatus: "GREEN",
};

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  searchController = new SearchController();
  authController = new AuthController();
  messageController = new MessageController();
  await authController.createUser(testUser1, true);
  await authController.createUser(testUser2, true);
  await authController.createUser(testUser3);
  await authController.createUser(testUser4);
  await messageController.postMessage(testMessage1);
  await messageController.postMessage(testMessage2);
  await messageController.postMessage(testMessage3);
  await messageController.postMessage(testMessage4);
  await messageController.postMessage(testMessage5);
  await messageController.postMessage(testMessage6);
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("searchInformation", () => {
  it("should throw an error when context is not recognized", async () => {
    try {
      await searchController.searchInformation("unknown", "test");
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.BAD_REQUEST_CODE);
    }
  });

  it("should throw an error when sender is not provided for messages context", async () => {
    try {
      await searchController.searchInformation("messages", "test");
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.BAD_REQUEST_CODE);
    }
  });

  it("should throw an error when sendee is not provided for messages context", async () => {
    try {
      await searchController.searchInformation("messages", "test", "aaa1");
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.BAD_REQUEST_CODE);
    }
  });

  it("should search for citizens correctly", async () => {
    const result = await searchController.searchInformation("citizens", "aaa1");
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(ESNUser);
  });

  it("should search for messages correctly", async () => {
    const result = await searchController.searchInformation(
      "messages",
      "message",
      "aaa1",
      "Lobby"
    );
    expect(result).toBeInstanceOf(Array);
    expect(result).not.toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Message);
    expect(result[1]).toBeInstanceOf(Message);
  });

  it("should search for announcements correctly", async () => {
    const result = await searchController.searchInformation(
      "announcements",
      "Announcement",
      "aaa1",
      "Announcement"
    );
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Message);
  });
});

describe("searchMessage", () => {
  it("Public: should return null if search for stop words", async () => {
    const result = await searchController.searchMessage("is", "aaa1", "Lobby");
    expect(result).toEqual([]);
  });

  it("Public: should search for and get all messages by content", async () => {
    const result = await searchController.searchMessage(
      "message",
      "aaa1",
      "Lobby"
    );
    expect(result).toBeInstanceOf(Array);
    expect(result).not.toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Message);
    expect(result[1]).toBeInstanceOf(Message);
  });

  it("Private: should return null if search for stop words", async () => {
    const result = await searchController.searchMessage("is", "aaa1", "aaa2");
    expect(result).toEqual([]);
  });

  it("Private: should search for messages by status", async () => {
    const result = await searchController.searchMessage(
      "status",
      "aaa2",
      "aaa1"
    );
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Message);
  });

  it("Private: should search for and get all messages by content", async () => {
    const result = await searchController.searchMessage(
      "message",
      "aaa1",
      "aaa2"
    );
    expect(result).toBeInstanceOf(Array);
    expect(result).not.toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Message);
    expect(result[1]).toBeInstanceOf(Message);
  });
});

describe("searchCitizen", () => {
  it("should search for users by status", async () => {
    const result = await searchController.searchCitizen("UNDEFINE");
    expect(result).toBeInstanceOf(Array);
    expect(result).not.toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ESNUser);
    expect(result[1]).toBeInstanceOf(ESNUser);
  });

  it("should search for users by username", async () => {
    const result = await searchController.searchCitizen("aaa1");
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(ESNUser);
  });
});

describe("searchAnnouncement", () => {
  it("should return null if search for stop words", async () => {
    const result = await searchController.searchAnnouncement("is");
    expect(result).toEqual([]);
  });

  it("should search for announcements by content", async () => {
    const result = await searchController.searchAnnouncement("Announcement");
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Message);
  });
});
