import AuthController from "../../src/auth/auth.controller";
import ESNDatabase from "../../src/database/ESNDatabase";
import { LoginCredentials } from "../../src/types/types";
import { ESNUser } from "../../src/user/user";

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
    };
    const noPasswordUser: ESNUser = {
      id: 2,
      username: "user",
      password: "",
    };
    const illegalPasswordUser: ESNUser = {
      id: 2,
      username: "user",
      password: "tes",
    };

    const loginCredential1: LoginCredentials =
      await authController.createUser(noUsernameUser);
    const loginCredential2: LoginCredentials =
      await authController.createUser(noPasswordUser);
    const loginCredential3: LoginCredentials =
      await authController.createUser(illegalPasswordUser);

    expect(loginCredential1).not.toBeNull();
    expect(loginCredential2).not.toBeNull();
    expect(loginCredential3).not.toBeNull();
    expect(loginCredential1.status).toEqual(400);
    expect(loginCredential2.status).toEqual(400);
    expect(loginCredential3.status).toEqual(400);
  });
});
