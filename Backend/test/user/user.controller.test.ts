import ESNDatabase from "../../src/database/ESNDatabase";
import UserController from "../../src/user/user.controller";
import UserDAO from "../../src/user/user.dao";
import { ESNUser } from "../../src/user/user.entity";
import AuthController from "../../src/auth/auth.controller";
import { notFoundException } from "../../src/util/exceptionHandler";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let userController: UserController;
let userDao: UserDAO;
let authController: AuthController;

const defaultESNUser = {
  id: null,
  username: "",
  password: "",
  lastStatus: "GREEN",
  isOnline: false,
  lastTimeUpdateStatus: new Date(),
};

const testUser1: ESNUser = {
  ...defaultESNUser,
  id: 1,
  username: "test1",
  password: "1234",
};

const testUser2: ESNUser = {
  ...defaultESNUser,
  id: 2,
  username: "test2",
  password: "1234",
};

const testUser3: ESNUser = {
  ...defaultESNUser,
  id: 3,
  username: "test3",
  password: "1234",
};

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  userDao = new UserDAO();
  userController = new UserController();
  authController = new AuthController();
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("getAllUserStatus", () => {
  it("Should get empty users if no user exits in database.", async () => {
    const returnedAllUserStatus = await userController.getAllUserStatus();

    expect(returnedAllUserStatus).toEqual([]);
  });

  it("Should get all users in the database.", async () => {
    await authController.createUser(testUser1);
    await authController.createUser(testUser2);
    await authController.createUser(testUser3);
    await userDao.updateESNUserStatus(testUser1.username, "1");
    await userDao.updateESNUserStatus(testUser2.username, "2");
    await userDao.updateESNUserStatus(testUser3.username, "3");

    const returnedAllUserStatus = await userController.getAllUserStatus();
    expect(returnedAllUserStatus).toEqual([
      { lastStatus: "1", username: "test1", isOnline: false },
      { lastStatus: "2", username: "test2", isOnline: false },
      { lastStatus: "3", username: "test3", isOnline: false },
    ]);
  });
});

describe("updateUserOnlineStatus", () => {
  it("Should return null user if user does not exist", async () => {
    try {
      await userController.updateUserOnlineStatus(testUser1.username, "true");
    } catch (error) {
      expect(error).toBeInstanceOf(notFoundException);
    }
  });

  it("Should change the status of user if user exists", async () => {
    await authController.createUser(testUser1);
    const updatedUser = await userController.updateUserOnlineStatus(
      testUser1.username,
      "true"
    );
    expect(updatedUser).not.toBeNull();
    expect(updatedUser.username).toEqual(testUser1.username);
    expect(updatedUser.isOnline).toEqual(true);
    const updatedUser2 = await userController.updateUserOnlineStatus(
      testUser1.username,
      "false"
    );
    expect(updatedUser2.isOnline).toEqual(false);
  });
});

describe("updateUserStatus", () => {
  it("Should return null user if user does not exist", async () => {
    try {
      await userController.updateUserStatus(testUser1.username, "GREEN");
    } catch (error) {
      expect(error).toBeInstanceOf(notFoundException);
    }
  });

  it("Should change the lastStatus of user if user exists", async () => {
    await authController.createUser(testUser1);
    const updatedUser = await userController.updateUserStatus(
      testUser1.username,
      "GREEN"
    );
    expect(updatedUser).not.toBeNull();
    expect(updatedUser.username).toEqual(testUser1.username);
    expect(updatedUser.lastStatus).toEqual("GREEN");
    const updatedUser2 = await userController.updateUserStatus(
      testUser1.username,
      "RED"
    );
    expect(updatedUser2.lastStatus).toEqual("RED");
  });
});

describe("getUserStatusByUsername", () => {
  it("Should return null user if user does not exist", async () => {
    try {
      await userController.getUserStatusByUsername(testUser1.username);
    } catch (error) {
      expect(error).toBeInstanceOf(notFoundException);
    }
  });

  it("Should return the lastStatus of user if user exists", async () => {
    await authController.createUser(testUser1);
    const status = await userController.getUserStatusByUsername(
      testUser1.username
    );
    expect(status).toEqual("GREEN");
    const updatedUser2 = await userController.updateUserStatus(
      testUser1.username,
      "RED"
    );
    const status2 = await userController.getUserStatusByUsername(
      testUser1.username
    );
    expect(status2).toEqual("RED");
  });
});
