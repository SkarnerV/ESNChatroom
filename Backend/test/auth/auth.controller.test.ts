import AuthController from "../../src/auth/auth.controller";
import ESNDatabase from "../../src/database/ESNDatabase";
import { LoginCredentials } from "../../src/types/types";
import { ESNUser } from "../../src/user/user.entity";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let authController: AuthController;

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
      id: 0,
      username: "test_username",
      password: "test_password",
      lastStatus: "GREEN",
      isOnline: false,
    };

    const loginCredential: LoginCredentials =
      await authController.createUser(testESNUser);

    expect(loginCredential).not.toBeNull();
    expect(loginCredential.status).toEqual(201);
  });

  it("Should return error message if username is not valid", async () => {
    const noUsernameUser: ESNUser = {
      id: 1,
      username: "",
      password: "test_password",
      lastStatus: "GREEN",
      isOnline: false,
    };
    const noPasswordUser: ESNUser = {
      id: 2,
      username: "user",
      password: "",
      lastStatus: "GREEN",
      isOnline: false,
    };
    const illegalPasswordUser: ESNUser = {
      id: 2,
      username: "user",
      password: "tes",
      lastStatus: "GREEN",
      isOnline: false,
    };

    const noStatusUser: ESNUser = {
      id: 2,
      username: "user",
      password: "test_password",
      lastStatus: "",
      isOnline: false,
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

describe("loginLogoutUser", () => {
  it("should update user's online status to true when login", async () => {
    const testESNUser: ESNUser = {
      id: 0,
      username: "test_username",
      password: "test_password",
      lastStatus: "GREEN",
      isOnline: false,
    };

    await authController.createUser(testESNUser);
    await authController.loginUser(testESNUser);

    const user = await databaseInstance
      .getDataSource()
      .getRepository(ESNUser)
      .findOneBy({username: testESNUser.username});
    expect(user?.isOnline).toBe(true);
  });

  it("should update user's online status to false when logout", async () => {
    const testESNUser: ESNUser = {
      id: 0,
      username: "test_username",
      password: "test_password",
      lastStatus: "GREEN",
      isOnline: false,
    };
    
    await authController.createUser(testESNUser);
    await authController.loginUser(testESNUser);
    const loginCredential: LoginCredentials =
      await authController.loginUser(testESNUser);
    
    if (loginCredential.token) {
      await authController.logoutUser(loginCredential.token);

      const user = await databaseInstance
        .getDataSource()
        .getRepository(ESNUser)
        .findOneBy({username: testESNUser.username});
      expect(user?.isOnline).toBe(false);
    } else {
      fail();
    }
  });

  it("should return error message if token is not valid", async () => {
    const invalidToken = "invalid token";
    const response = await authController.logoutUser(invalidToken);
  
    expect(response).toBeDefined();
    expect(response.status).toEqual(400);
    expect(response.message).toEqual("Account does not exits");
  });
  
});
