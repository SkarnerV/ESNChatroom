import AuthController from "../../src/auth/auth.controller";
import ESNDatabase from "../../src/database/ESNDatabase";
import { LoginCredentials } from "../../src/types/types";
import { ESNUser } from "../../src/user/user.entity";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let authController: AuthController;
const defaultESNUser = {
  id: null,
  username: "",
  password: "",
  lastStatus: "GREEN",
  isOnline: false,
  lastTimeUpdateStatus: new Date(),
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
    const testESNUser: ESNUser = {
      ...defaultESNUser,
      id: 0,
      username: "test_username",
      password: "test_password",
    };

    const loginCredential: LoginCredentials =
      await authController.createUser(testESNUser);

    expect(loginCredential).not.toBeNull();
    expect(loginCredential.status).toEqual(201);
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
      isOnline: false,
      lastTimeUpdateStatus: new Date(),
    };

    const loginCredential1: LoginCredentials =
      await authController.createUser(noUsernameUser);
    const loginCredential2: LoginCredentials =
      await authController.createUser(noPasswordUser);
    const loginCredential3: LoginCredentials =
      await authController.createUser(illegalPasswordUser);
    const loginCredential4: LoginCredentials =
      await authController.createUser(noStatusUser);

    expect(loginCredential1).not.toBeNull();
    expect(loginCredential2).not.toBeNull();
    expect(loginCredential3).not.toBeNull();
    expect(loginCredential4).not.toBeNull();
    expect(loginCredential1.status).toEqual(400);
    expect(loginCredential2.status).toEqual(400);
    expect(loginCredential3.status).toEqual(400);
  });
});

describe("loginUser", () => {
  beforeEach(async () => {
    const testESNUser: ESNUser = {
      id: 0,
      username: "test_username",
      password: "test_password",
      lastStatus: "GREEN",
      isOnline: false,
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
      isOnline: false,
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
      isOnline: false,
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
