import ESNDatabase from "../../src/database/ESNDatabase";
import UserController from "../../src/user/user.controller";
import UserDAO from "../../src/user/user.dao";
import { ESNUser } from "../../src/user/user.entity";
import AuthController from "../../src/auth/auth.controller";
import {
  Exception,
  NotFoundException,
  StatusCode,
} from "../../src/util/exception";
import { UserStatus } from "../../src/user/userStatus";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let userController: UserController;
let userDao: UserDAO;
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
  username: "aaa3",
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
    await userDao.updateUserStatus(testUser1.username, "1");
    await userDao.updateUserStatus(testUser2.username, "2");
    await userDao.updateUserStatus(testUser3.username, "3");

    const returnedAllUserStatus = await userController.getAllUserStatus();
    expect(returnedAllUserStatus).toEqual([
      { lastStatus: "1", username: "aaa1" },
      { lastStatus: "2", username: "aaa2" },
      { lastStatus: "3", username: "aaa3" },
    ]);
  });
});

describe("updateUserStatus", () => {
  it("Should return null user if user does not exist", async () => {
    try {
      await userController.updateUserStatus(
        testUser1.username,
        UserStatus.GREEN
      );
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it("Should change the lastStatus of user if user exists", async () => {
    await authController.createUser(testUser1);
    const updatedUser = await userController.updateUserStatus(
      testUser1.username,
      UserStatus.GREEN
    );
    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.username).toEqual(testUser1.username);
    expect(updatedUser?.lastStatus).toEqual(UserStatus.GREEN);
    const updatedUser2 = await userController.updateUserStatus(
      testUser1.username,
      UserStatus.RED
    );
    expect(updatedUser2?.lastStatus).toEqual(UserStatus.RED);
  });

  it("Should not change the lastStatus of user if status is not provided ", async () => {
    await authController.createUser(testUser1);
    const updatedUser = await userController.updateUserStatus(
      testUser1.username
    );

    expect(updatedUser?.lastStatus).toEqual(UserStatus.UNDEFINE);
  });

  // it("Should throw BadRequestException if the Status is illegal", async () => {
  //   try {
  //     await authController.createUser(testUser1);
  //     await userController.updateUserStatus(testUser1.username, "dawd");
  //   } catch (error) {
  //     expect((error as Exception).status).toEqual(StatusCode.BAD_REQUEST_CODE);
  //   }
  // });
});

describe("getUserStatusByUsername", () => {
  it("Should return null user if user does not exist", async () => {
    try {
      await userController.getUserStatusByUsername(testUser1.username);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it("Should return the lastStatus of user if user exists", async () => {
    await authController.createUser(testUser1);
    const status = await userController.getUserStatusByUsername(
      testUser1.username
    );
    expect(status).toEqual(UserStatus.UNDEFINE);
    await userController.updateUserStatus(testUser1.username, UserStatus.RED);
    const status2 = await userController.getUserStatusByUsername(
      testUser1.username
    );
    expect(status2).toEqual(UserStatus.RED);
  });
});
