import ESNDatabase from "../../src/database/ESNDatabase";
import UserController from "../../src/user/user.controller";
import UserDAO from "../../src/user/user.dao";
import { ESNUser } from "../../src/user/user.entity";
import AuthController from "../../src/auth/auth.controller";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let userController: UserController;
let userDao: UserDAO;
let authController: AuthController;
const testUser1: ESNUser = {
  id: 1,
  username: "test1",
  password: "1234",
  lastStatus: "1",
  is_online: false
};

const testUser2: ESNUser = {
  id: 2,
  username: "test2",
  password: "1234",
  lastStatus: "2",
  is_online: false
};

const testUser3: ESNUser = {
  id: 3,
  username: "test3",
  password: "1234",
  lastStatus: "3",
  is_online: false
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
    await userDao.updateESNUserStatus(testUser1, "1");
    await userDao.updateESNUserStatus(testUser2, "2");
    await userDao.updateESNUserStatus(testUser3, "3");

    const returnedAllUserStatus = await userController.getAllUserStatus();
    expect(returnedAllUserStatus).toEqual([
      { lastStatus: "1", username: "test1", is_online: false },
      { lastStatus: "2", username: "test2", is_online: false },
      { lastStatus: "3", username: "test3", is_online: false },
    ]);
  });
});
