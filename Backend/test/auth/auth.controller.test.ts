import AuthController from "../../src/auth/auth.controller";
import ESNDatabase from "../../src/database/ESNDatabase";
import { CreateUserInput, LoginCredentials } from "../../src/types/types";
import { ESNUser } from "../../src/user/user.entity";
import jwt from "jsonwebtoken";

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

    const loginCredential: LoginCredentials =
      await authController.createUser(testESNUser);

    expect(loginCredential).not.toBeNull();
    expect(loginCredential.status).toEqual(201);
  });

  it("Should not create a user with banned usernames.", async () => {
    const testESNUser: CreateUserInput = {
      username: "test",
      password: "test_password",
    };

    const createdMessage: LoginCredentials =
      await authController.createUser(testESNUser);

    expect(createdMessage.status).toEqual(400);
  });

  it("Should create a user with unbanned usernames.", async () => {
    const testESNUser: CreateUserInput = {
      username: "aaa",
      password: "test_password",
    };

    const createdMessage: LoginCredentials =
      await authController.createUser(testESNUser);

    expect(createdMessage.status).toEqual(201);
  });

  it("Should create a user with legal username length.", async () => {
    const testESNUser: CreateUserInput = {
      username: "aaaaa",
      password: "test_password",
    };

    const createdMessage: LoginCredentials =
      await authController.createUser(testESNUser);

    expect(createdMessage.status).toEqual(201);
  });

  it("Should not create a user with illegal username length.", async () => {
    const testESNUser: CreateUserInput = {
      username: "1",
      password: "test_password",
    };

    const createdMessage: LoginCredentials =
      await authController.createUser(testESNUser);

    expect(createdMessage.status).toEqual(400);
  });

  it("Should not create a user with illegal password length.", async () => {
    const testESNUser: CreateUserInput = {
      username: "aaa",
      password: "pa",
    };

    const createdMessage: LoginCredentials =
      await authController.createUser(testESNUser);

    expect(createdMessage.status).toEqual(400);
  });

  it("Should create a user with legal password length.", async () => {
    const testESNUser: CreateUserInput = {
      username: "aaa",
      password: "password",
    };

    const createdMessage: LoginCredentials =
      await authController.createUser(testESNUser);

    expect(createdMessage.status).toEqual(201);
  });

  it("Should create case-insensitive username.", async () => {
    const testESNUser: CreateUserInput = {
      username: "Aaa",
      password: "test_password",
    };

    const createdMessage: LoginCredentials =
      await authController.createUser(testESNUser);
    const createdUser = jwt.decode(
      createdMessage.token as string
    ) as jwt.JwtPayload;

    expect(createdUser.username).toEqual("aaa");
  });

  it("Should create case-insensitive username.", async () => {
    const testESNUser: CreateUserInput = {
      username: "AAA",
      password: "test_password",
    };

    const createdMessage: LoginCredentials =
      await authController.createUser(testESNUser);
    const createdUser = jwt.decode(
      createdMessage.token as string
    ) as jwt.JwtPayload;

    expect(createdUser.username).toEqual("aaa");
  });

  it("Should login with the correct password.", async () => {
    const testESNUser: CreateUserInput = {
      username: "AAA",
      password: "PASSWORD",
    };

    await authController.createUser(testESNUser);
    const loginMessage: LoginCredentials =
      await authController.loginUser(testESNUser);

    expect(loginMessage.status).toEqual(200);
  });

  it("Should not allow case insensitive password.", async () => {
    const testESNUser: CreateUserInput = {
      username: "AAA",
      password: "PASSWORD",
    };

    await authController.createUser(testESNUser);
    const loginMessage: LoginCredentials = await authController.loginUser({
      username: "AAA",
      password: "password",
    });

    expect(loginMessage.status).toEqual(401);
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

    const loginCredential1: LoginCredentials =
      await authController.createUser(noUsernameUser);
    const loginCredential2: LoginCredentials =
      await authController.createUser(noPasswordUser);
    const loginCredential3: LoginCredentials =
      await authController.createUser(illegalPasswordUser);
    const loginCredential4: LoginCredentials =
      await authController.createUser(noStatusUser);

    expect(loginCredential1.status).toEqual(400);
    expect(loginCredential2.status).toEqual(400);
    expect(loginCredential3.status).toEqual(400);
    expect(loginCredential4.status).toEqual(400);
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

    const loginCredential: LoginCredentials =
      await authController.createUser(testESNUser);

    expect(loginCredential).not.toBeNull();
    expect(loginCredential.status).toEqual(201);
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

    const loginCredential: LoginCredentials =
      await authController.loginUser(testESNUser);

    expect(loginCredential).not.toBeNull();
    expect(loginCredential.status).toEqual(200);
    expect(loginCredential.message).toEqual("User Logined");
    expect(loginCredential.token).not.toBeNull();
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

    const loginCredential: LoginCredentials =
      await authController.loginUser(testESNUser);

    expect(loginCredential).not.toBeNull();
    expect(loginCredential.status).toEqual(401);
    expect(loginCredential.message).toEqual(
      "Re-enter the username and/or password"
    );
  });

  it("Should return an error if the account does not exist", async () => {
    const testESNUser: ESNUser = {
      ...defaultESNUser,
      id: 0,
      username: "wrong_username",
      password: "test_password",
    };

    const loginCredential: LoginCredentials =
      await authController.loginUser(testESNUser);

    expect(loginCredential).not.toBeNull();
    expect(loginCredential.status).toEqual(400);
    expect(loginCredential.message).toEqual("Account does not exits");
  });
});
