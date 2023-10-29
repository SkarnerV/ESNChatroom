import AuthDao from "../../src/auth/auth.dao";
import ESNDatabase from "../../src/database/ESNDatabase";
import { LoginAuthentication } from "../../src/types/types";
import { ESNUser } from "../../src/user/user.entity";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let authDao: AuthDao;

const defaultESNUser = {
  id: null,
  username: "",
  password: "",
  lastStatus: "GREEN",
  lastTimeUpdateStatus: new Date(),
  lastOnlineTime: new Date().getTime().toString(),
};

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  authDao = new AuthDao();
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("createUser", () => {
  it("should create user", async () => {
    const testESNUser: ESNUser = {
      ...defaultESNUser,
      id: 1,
      username: "test_username",
      password: "test_password",
    };

    const userId: string = (
      await authDao.createUser(testESNUser)
    ).id.toString();
    expect(userId).toBe("1");
  });
});

describe("getUserId", () => {
  it("should get user ID", async () => {
    const testESNUser: ESNUser = {
      ...defaultESNUser,
      id: 1,
      username: "test_username",
      password: "test_password",
    };

    await authDao.createUser(testESNUser);
    const userId: string = await authDao.getUserId(testESNUser.username);
    expect(userId).toBe("1");
  });

  it("should return empty string if user not found", async () => {
    const username = "random_username";
    const userId: string = await authDao.getUserId(username);
    expect(userId).toBe("");
  });
});

// describe("checkUserLogin", () => {
//   it("should check user login successfully", async () => {
//     const testESNUser: ESNUser = {
//       ...defaultESNUser,
//       id: 1,
//       username: "test_username",
//       password: "test_password",
//     };

//     await authDao.createUser(testESNUser);
//     const loginAuth: LoginAuthentication = await authDao.checkUserLogin(
//       testESNUser.username,
//       testESNUser.password
//     );

//     expect(loginAuth.userExists).toBe(true);
//     expect(loginAuth.passwordMatch).toBe(true);
//   });

//   it("should fail user login due to incorrect password", async () => {
//     const testESNUser: ESNUser = {
//       ...defaultESNUser,
//       id: 1,
//       username: "test_username",
//       password: "test_password",
//     };

//     await authDao.createUser(testESNUser);
//     const loginAuth: LoginAuthentication = await authDao.checkUserLogin(
//       testESNUser.username,
//       "wrong_password"
//     );

//     expect(loginAuth.userExists).toBe(true);
//     expect(loginAuth.passwordMatch).toBe(false);
//   });
// });
