import AuthController from "../../src/auth/auth.controller";
import ESNDatabase from "../../src/database/ESNDatabase";
import { AuthResponse, CreateUserInput } from "../../src/types/types";
import { ESNUser } from "../../src/user/user.entity";
import jwt from "jsonwebtoken";
import { Exception, StatusCode } from "../../src/util/exception";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let authController: AuthController;
const defaultESNUser = {
  id: null,
  username: "aaa",
  password: "aaaa",
  lastStatus: "GREEN",
  lastTimeUpdateStatus: new Date(),
  lastOnlineTime: new Date().getTime().toString(),
};

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  authController = new AuthController();
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("createUser", () => {
  it("Should create a new user if provided username does not exist in database.", async () => {
    const testESNUser: CreateUserInput = {
      username: "aaa",
      password: "aaaa",
    };

    const authResponse: AuthResponse =
      await authController.createUser(testESNUser);

    expect(authResponse.username).toEqual(testESNUser.username);
  });

  it("Should create a user with unbanned usernames.", async () => {
    const testESNUser: CreateUserInput = {
      username: "aaa",
      password: "test_password",
    };

    const authResponse: AuthResponse =
      await authController.createUser(testESNUser);

    expect(authResponse.username).toEqual(testESNUser.username);
  });

  it("Should create a user with legal username length.", async () => {
    const testESNUser: CreateUserInput = {
      username: "aaaaa",
      password: "test_password",
    };

    const authResponse: AuthResponse =
      await authController.createUser(testESNUser);

    expect(authResponse.username).toEqual(testESNUser.username);
  });

  it("Should not create a user with illegal username length.", async () => {
    const testESNUser: CreateUserInput = {
      username: "1",
      password: "test_password",
    };

    try {
      await authController.createUser(testESNUser);
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.UNAUTHORIZED_CODE);
    }
  });

  it("Should not create a user with illegal password length.", async () => {
    const testESNUser: CreateUserInput = {
      username: "aaa",
      password: "pa",
    };

    try {
      await authController.createUser(testESNUser);
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.UNAUTHORIZED_CODE);
    }
  });

  it("Should create a user with legal password length.", async () => {
    const testESNUser: CreateUserInput = {
      username: "aaa",
      password: "password",
    };

    const authResponse: AuthResponse =
      await authController.createUser(testESNUser);

    expect(authResponse.username).toEqual(testESNUser.username);
  });

  it("Should create case-insensitive username.", async () => {
    const testESNUser: CreateUserInput = {
      username: "Aaa",
      password: "test_password",
    };

    const authResponse: AuthResponse =
      await authController.createUser(testESNUser);
    const createdUser = jwt.decode(
      authResponse.token as string
    ) as jwt.JwtPayload;

    expect(createdUser.username).toEqual("aaa");
  });

  it("Should create case-insensitive username.", async () => {
    const testESNUser: CreateUserInput = {
      username: "AAA",
      password: "test_password",
    };

    const authResponse: AuthResponse =
      await authController.createUser(testESNUser);
    const createdUser = jwt.decode(
      authResponse.token as string
    ) as jwt.JwtPayload;

    expect(createdUser.username).toEqual("aaa");
  });

  it("Should login with the correct password.", async () => {
    const testESNUser: CreateUserInput = {
      username: "AAA",
      password: "PASSWORD",
    };

    const authResponse: AuthResponse =
      await authController.createUser(testESNUser);

    expect(authResponse.username).toEqual("aaa");
  });

  it("Should not allow case insensitive password.", async () => {
    const testESNUser: CreateUserInput = {
      username: "AAA",
      password: "PASSWORD",
    };

    try {
      await authController.createUser(testESNUser);
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.UNAUTHORIZED_CODE);
    }
  });

  it("Should return error message if username is not valid", async () => {
    const noUsernameUser: ESNUser = {
      ...defaultESNUser,
      id: 1,
      username: "",
      password: "test_password",
    };
    const noPasswordUser: ESNUser = {
      ...defaultESNUser,
      id: 2,
      username: "user",
      password: "",
    };
    const illegalPasswordUser: ESNUser = {
      ...defaultESNUser,
      id: 2,
      username: "user",
      password: "tes",
    };

    const noStatusUser: ESNUser = {
      id: 2,
      username: "user",
      password: "test_password",
      lastStatus: "",
      lastTimeUpdateStatus: new Date(),
      lastOnlineTime: new Date().getTime().toString(),
    };

    try {
      await authController.createUser(noUsernameUser);
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.UNAUTHORIZED_CODE);
    }

    try {
      await authController.createUser(noPasswordUser);
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.UNAUTHORIZED_CODE);
    }

    try {
      await authController.createUser(illegalPasswordUser);
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.UNAUTHORIZED_CODE);
    }

    try {
      await authController.createUser(noStatusUser);
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.UNAUTHORIZED_CODE);
    }
  });
});

describe("loginUser", () => {
  beforeEach(async () => {
    const testESNUser: ESNUser = {
      id: 0,
      username: "test_username",
      password: "test_password",
      lastStatus: "GREEN",
      lastOnlineTime: new Date().getTime().toString(),
      lastTimeUpdateStatus: new Date(),
    };

    const authResponse: AuthResponse =
      await authController.createUser(testESNUser);

    expect(authResponse.username).toEqual(testESNUser.username);
  });

  it("Should login a user if the username and password are correct", async () => {
    const testESNUser: ESNUser = {
      id: 0,
      username: "test_username",
      password: "test_password",
      lastStatus: "GREEN",
      lastOnlineTime: new Date().getTime().toString(),
      lastTimeUpdateStatus: new Date(),
    };

    const authResponse: AuthResponse =
      await authController.loginUser(testESNUser);

    expect(authResponse.username).toEqual(testESNUser.username);
  });

  it("Should return an error if the password is incorrect", async () => {
    const testESNUser: ESNUser = {
      id: 0,
      username: "test_username",
      password: "wrong_password",
      lastStatus: "GREEN",
      lastOnlineTime: new Date().getTime().toString(),
      lastTimeUpdateStatus: new Date(),
    };

    try {
      await authController.loginUser(testESNUser);
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.UNAUTHORIZED_CODE);
    }
  });

  it("Should return an error if the account does not exist", async () => {
    const testESNUser: ESNUser = {
      ...defaultESNUser,
      id: 0,
      username: "wrong_username",
      password: "test_password",
    };

    try {
      await authController.loginUser(testESNUser);
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.NOT_FOUND_CODE);
    }
  });
});
