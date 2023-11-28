import ESNDatabase from "../../src/database/ESNDatabase";
import LikesDAO from "../../src/likes/likes.dao";
import { Likes } from "../../src/likes/likes.entity";
import MessageDAO from "../../src/message/message.dao";
import { LikesMessageInput } from "../../src/types/types";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let likesDao: LikesDAO;
let messageDao: MessageDAO;

const message1 = {
  id: 1,
  content: "string",
  time: "string",
  sender: "string",
  sendee: "Post",
  senderStatus: "string",
};

const message2 = {
  id: 2,
  content: "string",
  time: "string",
  sender: "string",
  sendee: "Post",
  senderStatus: "string",
};

const message3 = {
  id: 3,
  content: "string",
  time: "string",
  sender: "string",
  sendee: "Post",
  senderStatus: "string",
};

const testLike1: LikesMessageInput = {
  postId: message1.id,
  username: "aaa",
};
const testLike2: LikesMessageInput = {
  postId: message2.id,
  username: "aaa",
};

const testLike3: LikesMessageInput = {
  postId: message3.id,
  username: "bbb",
};

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  likesDao = new LikesDAO();
  messageDao = new MessageDAO();
  await messageDao.createMessage(message1);
  await messageDao.createMessage(message2);
  await messageDao.createMessage(message3);
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("getAllLikes", () => {
  it("Should get all likes in the database", async () => {
    await likesDao.createLike(testLike1, message1);
    await likesDao.createLike(testLike3, message3);
    const allLikes: Likes[] = await likesDao.getAllLikes();

    expect(allLikes.map((like) => like.username)).toEqual([
      testLike1.username,
      testLike3.username,
    ]);
  });

  it("Should empty list if no likes is stored", async () => {
    const allLikes: Likes[] = await likesDao.getAllLikes();

    expect(allLikes).toEqual([]);
  });
});

describe("createLike", () => {
  it("Should create a like in the database", async () => {
    await likesDao.createLike(testLike1, message1);

    const allLikes: Likes[] = await likesDao.getAllLikes();

    expect(allLikes.map((like) => like.username)).toEqual([testLike1.username]);
  });
});

describe("deleteLike", () => {
  it("Should delete a like in the database", async () => {
    const createdLike = await likesDao.createLike(testLike1, message1);

    const allLikes: Likes[] = await likesDao.getAllLikes();

    expect(allLikes.map((like) => like.username)).toEqual([testLike1.username]);

    await likesDao.deleteOneById(createdLike.id);

    const likesAfterDeleted = await likesDao.getAllLikes();

    expect(likesAfterDeleted.map((like) => like.username)).toEqual([]);
  });

  it("Should not delete a like in the database if the like does not exits", async () => {
    await likesDao.deleteOneById(1);

    const likesAfterDeleted = await likesDao.getAllLikes();

    expect(likesAfterDeleted.map((like) => like.username)).toEqual([]);
  });
});
