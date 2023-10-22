import ESNDatabase from "../../src/database/ESNDatabase";
import UserDAO from "../../src/user/user.dao";
import { ESNUser } from "../../src/user/user.entity";
import AuthController from "../../src/auth/auth.controller";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let userDao: UserDAO;
let authController: AuthController;
const defaultESNUser = {
  id: null,
  username: "aaa",
  password: "aaaa",
  lastStatus: "GREEN",
  isOnline: false,
  lastTimeUpdateStatus: new Date(),
  lastOnlineTime: new Date().getTime().toString(),
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
    const updatedUser: ESNUser | null = await userDao.updateESNUserStatus(
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
    await userDao.updateESNUserStatus(testUser1.username, "1");
    await userDao.updateESNUserStatus(testUser2.username, "2");
    const allUsers = await userDao.getAllESNUserStatus();
    expect(allUsers).not.toBeNull();
    expect(allUsers).toEqual([
      { lastStatus: "1", username: "aaa1", isOnline: false },
      { lastStatus: "2", username: "aaa2", isOnline: false },
    ]);
  });
});

describe("getUserStatusByUsername", () => {
  it("Should return the lastStatus of user if user exists", async () => {
    await authController.createUser(testUser1);
    const status = await userDao.getUserStatus(testUser1.username);
    expect(status).toEqual("GREEN");
    const updatedUser2 = await userDao.updateESNUserStatus(
      testUser1.username,
      "RED"
    );
    const status2 = await userDao.getUserStatus(testUser1.username);
    expect(status2).toEqual("RED");
  });
});
