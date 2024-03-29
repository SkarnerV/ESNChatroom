import ESNDatabase from "../../src/database/ESNDatabase";
import UserDAO from "../../src/user/user.dao";
import { ESNUser } from "../../src/user/user.entity";
import AuthController from "../../src/auth/auth.controller";
import { UserStatus } from "../../src/user/userStatus";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let userDao: UserDAO;
let authController: AuthController;
const defaultESNUser = {
  id: null,
  username: "aaa",
  password: "aaaa",
  lastStatus: "GREEN",
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

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  userDao = new UserDAO();
  authController = new AuthController();
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("updateESNUserStatus", () => {
  it("Should change the status of user if user exists", async () => {
    await authController.createUser(testUser1);
    const updatedUser: ESNUser | null = await userDao.updateUserStatus(
      testUser1.username,
      "2"
    );
    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.lastStatus).toEqual("2");
  });
});

describe("getAllESNUserStatus", () => {
  it("Should return empty users if no users exist", async () => {
    const allUsers = await userDao.getAllESNUserStatus();

    expect(allUsers).not.toBeNull();
    expect(allUsers).toEqual([]);
  });

  it("Should return all users' info", async () => {
    await authController.createUser(testUser1);
    await authController.createUser(testUser2);
    await userDao.updateUserStatus(testUser1.username, "1");
    await userDao.updateUserStatus(testUser2.username, "2");
    const allUsers = await userDao.getAllESNUserStatus();
    expect(allUsers).not.toBeNull();
    expect(allUsers).toEqual([
      { lastStatus: "1", username: "aaa1" },
      { lastStatus: "2", username: "aaa2" },
    ]);
  });
});

describe("getUserByUsername", () => {
  it("Should return empty users if no users exist", async () => {
    const users = await userDao.getUserByUsername("aaa");
    expect(users).toEqual(null);
  });

  it("Should return all users' info", async () => {
    await authController.createUser(testUser1);
    const user: ESNUser | null = await userDao.getUserByUsername(
      testUser1.username
    );

    expect(user?.username).toEqual(testUser1.username);
  });
});

describe("getUsersByUsernames", () => {
  it("Should return empty users if no users exist", async () => {
    const users = await userDao.getUsersByUsernames([]);
    expect(users).toEqual([]);
  });

  it("Should return all users' info", async () => {
    await authController.createUser(testUser1);
    await authController.createUser(testUser2);
    const users = await userDao.getUsersByUsernames([
      testUser1.username,
      testUser2.username,
    ]);
    expect(users).not.toBeNull();
    expect([...users.map((u) => u.id)]).toEqual([testUser1.id, testUser2.id]);
  });
});

describe("getUsersByPartialUsername", () => {
  it("Should return empty users if no users exist", async () => {
    const users = await userDao.getUsersByPartialUsername("aaa");
    expect(users).toEqual([]);
  });

  it("Should return users whose username contain searching the words", async () => {
    await authController.createUser(testUser1);
    await authController.createUser(testUser2);
    const users = await userDao.getUsersByPartialUsername("aaa");
    expect(users).not.toBeNull();
    expect([...users.map((u) => u.username)]).toEqual([
      testUser1.username,
      testUser2.username,
    ]);
  });
});

describe("getUsersByStatus", () => {
  it("Should return empty users if no users exist", async () => {
    const users = await userDao.getUsersByStatus(UserStatus.RED);
    expect(users).toEqual([]);
  });

  it("Should return users whose status is the searching status", async () => {
    await authController.createUser(testUser1);
    await authController.createUser(testUser2);
    await userDao.updateUserStatus(testUser1.username, UserStatus.RED);
    await userDao.updateUserStatus(testUser2.username, UserStatus.RED);
    const users = await userDao.getUsersByStatus(UserStatus.RED);
    expect(users).not.toBeNull();
    expect([...users.map((u) => u.username)]).toEqual([
      testUser1.username,
      testUser2.username,
    ]);
  });
});
