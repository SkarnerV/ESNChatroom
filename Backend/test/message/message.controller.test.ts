import AuthController from "../../src/auth/auth.controller";
import ESNDatabase from "../../src/database/ESNDatabase";
import MessageController from "../../src/message/message.controller";
import { Message } from "../../src/message/message.entity";
import { CreateUserInput, PostMessageInput } from "../../src/types/types";
import { Exception, StatusCode } from "../../src/util/exception";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let messageController: MessageController;
let authController: AuthController;
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
  senderStatus: "GREEN",
};

const testMessage4: PostMessageInput = {
  content: "this is a test message4 ",
  sender: "1",
  sendee: "aaa",
  senderStatus: "GREEN",
};

const testMessage5: PostMessageInput = {
  content: "this is a test message5 ",
  sender: "1",
  sendee: "aaa",
  senderStatus: "GREEN",
};

const testPostMessage6: PostMessageInput = {
  content: "this is a post 6 ",
  sender: "1",
  sendee: "Post",
  senderStatus: "GREEN",
};

const testPostMessage7: PostMessageInput = {
  content: "this is a post 7 ",
  sender: "2",
  sendee: "Post",
  senderStatus: "GREEN",
};

const testPostMessage8: PostMessageInput = {
  content: "this is a post 8",
  sender: "3",
  sendee: "Post",
  senderStatus: "GREEN",
};

const testBadMessage2: Message = {
  id: 2,
  content: "this is a bad message2 ",
  time: "12:33PM",
  sender: "",
  sendee: "1",
  senderStatus: "GREEN",
};

const testBadMessage3: Message = {
  id: 3,
  content: "this is a bad message3 ",
  time: "12:33PM",
  sender: "2",
  sendee: "Lobby",
  senderStatus: "",
};

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  messageController = new MessageController();
  authController = new AuthController();
  const exampleUserinput: CreateUserInput = {
    username: "aaa",
    password: "aaaa",
  };

  await authController.createUser(exampleUserinput);
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("postMessage", () => {
  it("Should post a new message and gets the message returned.", async () => {
    const returnedMessage = await messageController.postMessage(testMessage1);

    expect(returnedMessage.content).toEqual(testMessage1.content);
  });

  it("Should throw BadRequestException if sender is not provided.", async () => {
    try {
      await messageController.postMessage(testBadMessage2);
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.BAD_REQUEST_CODE);
    }
  });

  it("Should throw BadRequestException if sender status is not provided.", async () => {
    try {
      await messageController.postMessage(testBadMessage3);
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.BAD_REQUEST_CODE);
    }
  });
});

describe("getAllMessages", () => {
  it("Should get empty messages if no message was sent after the user logout.", async () => {
    const returnedMessages = await messageController.getAllMessages("2", "1");

    expect(returnedMessages).toEqual([]);
  });
  it("Should get all messages in the database.", async () => {
    await messageController.postMessage(testMessage1);
    await messageController.postMessage(testMessage2);
    await messageController.postMessage(testMessage3);
    const returnedMessages = await messageController.getAllMessages(
      "1",
      "Lobby"
    );

    expect(returnedMessages.map((message) => message.content)).toEqual([
      testMessage1.content,
      testMessage2.content,
    ]);
  });
});

describe("getUnreadMessages", () => {
  it("Should get empty messages if no message exits in database.", async () => {
    const unreadMessages: Message[] =
      await messageController.getUnreadMessages("aaa");
    expect(unreadMessages).toEqual([]);
  });

  it("Should get empty messages if username does not exits in database.", async () => {
    const unreadMessages = await messageController.getUnreadMessages("user");
    expect(unreadMessages).toEqual([]);
  });

  it("Should get all messages after user's last online time.", async () => {
    await messageController.postMessage(testMessage4);
    await messageController.postMessage(testMessage5);
    const returnedMessages = await messageController.getUnreadMessages("aaa");

    expect(returnedMessages.map((message) => message.content)).toEqual([
      testMessage4.content,
      testMessage5.content,
    ]);
  });
});

describe("getLastMessage", () => {
  it("Should get empty messages if no message exits in database.", async () => {
    const lastMessage: Message[] = await messageController.getLastMessage(
      "1",
      "Lobby"
    );
    expect(lastMessage).toEqual([]);
  });

  it("Should get empty messages if username does not exits in database.", async () => {
    await messageController.postMessage(testMessage1);
    const lastMessage1 = await messageController.getLastMessage(
      testMessage1.sender,
      testMessage1.sendee
    );
    await messageController.postMessage(testMessage2);
    const lastMessage2 = await messageController.getLastMessage(
      testMessage1.sender,
      testMessage1.sendee
    );

    expect(lastMessage1[0].content).toEqual(testMessage1.content);
    expect(lastMessage2[0].content).toEqual(testMessage2.content);
  });
});

describe("likesPost", () => {
  it("Should add the likes to the message.", async () => {
    const createdPost: Message =
      await messageController.postMessage(testPostMessage8);
    const originalMessages = await messageController.getAllMessages(
      "a",
      "Post"
    );
    expect(originalMessages[0].likes?.length).toEqual(0);
    await messageController.likesPost({
      postId: createdPost.id,
      username: "a",
    });

    const allMessages = await messageController.getAllMessages("a", "Post");
    expect(allMessages[0].likes?.length).toEqual(1);
  });

  it("Should undo the likes to the message if user liked twice.", async () => {
    const createdPost: Message =
      await messageController.postMessage(testPostMessage8);
    const originalMessages = await messageController.getAllMessages(
      "a",
      "Post"
    );
    expect(originalMessages[0].likes?.length).toEqual(0);
    await messageController.likesPost({
      postId: createdPost.id,
      username: "a",
    });
    await messageController.likesPost({
      postId: createdPost.id,
      username: "a",
    });

    const allMessages = await messageController.getAllMessages("a", "Post");
    expect(allMessages[0].likes?.length).toEqual(0);
  });

  it("Should throw a Not found exception if the message liked is not found.", async () => {
    try {
      await messageController.likesPost({
        postId: 10,
        username: "a",
      });
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.NOT_FOUND_CODE);
    }
  });
});

describe("deletePost", () => {
  it("Should delete the post in the database.", async () => {
    const deletePost: Message =
      await messageController.postMessage(testPostMessage6);
    await messageController.postMessage(testPostMessage7);
    await messageController.postMessage(testPostMessage8);
    const originalMessages = await messageController.getAllMessages(
      "a",
      "Post"
    );
    expect(originalMessages.length).toEqual(3);
    await messageController.deletePost(deletePost.id);

    const allMessages = await messageController.getAllMessages("a", "Post");
    expect(allMessages.length).toEqual(2);
  });

  it("Should throw a Not found exception if the message deleted is not found.", async () => {
    try {
      await messageController.deletePost(999);
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.NOT_FOUND_CODE);
    }
  });
});
