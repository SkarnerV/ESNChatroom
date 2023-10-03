import ESNDatabase from "../../src/database/ESNDatabase";
import UserDAO from "../../src/user/user.dao";
import { ESNUser } from "../../src/user/user.entity";
import AuthController from "../../src/auth/auth.controller";
import { Exception, statusCode } from "../../src/util/exceptionHandler";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let userDao: UserDAO;
let authController: AuthController;
const testUser1: ESNUser = {
  id: 1,
  username: "test1",
  password: "1234",
  lastStatus: "1",
  isOnline: false
};

const testUser2: ESNUser = {
  id: 2,
  username: "test2",
  password: "1234",
  lastStatus: "2",
  isOnline: false
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
  it("Should return null user if user does not exist", async () => {
    try {
      const updatedUser = await userDao.updateESNUserStatus(testUser1, "2");
    } catch (error) {
      expect((error as Exception).status).toEqual(statusCode.NOT_FOUND);
    }
  });

  it("Should change the status of user if user exists", async () => {
    await authController.createUser(testUser1);
    const updatedUser = await userDao.updateESNUserStatus(testUser1, "2");
    expect(updatedUser).not.toBeNull();
    expect(updatedUser.lastStatus).toEqual("2");
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
    await userDao.updateESNUserStatus(testUser1, "1");
    await userDao.updateESNUserStatus(testUser2, "2");
    const allUsers = await userDao.getAllESNUserStatus();
    expect(allUsers).not.toBeNull();
    expect(allUsers).toEqual([
      { lastStatus: "1", username: "test1", isOnline: false },
      { lastStatus: "2", username: "test2", isOnline: false },
    ]);
  });
});
