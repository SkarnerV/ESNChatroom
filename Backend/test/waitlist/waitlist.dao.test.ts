import ESNDatabase from "../../src/database/ESNDatabase";
import WaitlistDAO from "../../src/waitlist/waitlist.dao";
import { WaitlistStatus } from "../../src/waitlist/waitlistStatus";
import { WaitlistUser } from "../../src/waitlist/waitlist.entity";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let waitlistDao: WaitlistDAO;
const defaultWaitlistUser = {
  id: null,
  username: "",
  waitlistStatus: "PENDING",
  foodDonor: "",
  foodComments: "",
  joinTime: new Date().getTime().toString(),
};

const testUser1: WaitlistUser = {
  ...defaultWaitlistUser,
  id: 1,
  username: "aaa1",
  foodComments: "One piece of bread and one bottle of water.",
};

const testUser2: WaitlistUser = {
  ...defaultWaitlistUser,
  id: 2,
  username: "aaa2",
  foodComments: "I need some pizza.",
};

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  waitlistDao = new WaitlistDAO();
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("createCitizenOnWaitlist", () => {
  it("Should create the citizen on the waitlist", async () => {
    const testOutput = await waitlistDao.createCitizenOnWaitlist(testUser1);
    expect(testOutput).not.toBeNull();
    expect(testOutput).toEqual(testUser1);
  });
});

describe("getAllCitizensInfo", () => {
  it("Should return empty users if no users exist", async () => {
    const allUsers = await waitlistDao.getAllCitizensInfo();

    expect(allUsers).not.toBeNull();
    expect(allUsers).toEqual([]);
  });
  it("Should return all users' info", async () => {
    const testOutput1 = await waitlistDao.createCitizenOnWaitlist(testUser1);
    const testOutput2 = await waitlistDao.createCitizenOnWaitlist(testUser2);

    const allUsers = await waitlistDao.getAllCitizensInfo();
    expect(allUsers).not.toBeNull();
    expect(allUsers).toEqual([testUser1, testUser2]);
  });
});

describe("getCitizenInfoByUsername", () => {
  it("Should return null if user not exists", async () => {
    const testOutput = await waitlistDao.getCitizenInfoByUsername("bbb1");

    expect(testOutput).toBeNull();
  });

  it("Should return null if user not exists", async () => {
    await waitlistDao.createCitizenOnWaitlist(testUser1);
    const testOutput = await waitlistDao.getCitizenInfoByUsername(
      testUser1.username
    );
    expect(testOutput).not.toBeNull();
    expect(testOutput).toEqual(testUser1);
  });
});

describe("updateCitizenOnWaitlist", () => {
  it("Should return null if user not exists", async () => {
    const testOutput = await waitlistDao.updateCitizenOnWaitlist("bbb1", "");
    expect(testOutput).toBeNull();
  });

  it("Can change the foodDonor of Citizen", async () => {
    await waitlistDao.createCitizenOnWaitlist(testUser1);
    const testOutput = await waitlistDao.updateCitizenOnWaitlist(
      testUser1.username,
      "Jamie"
    );
    expect(testOutput).not.toBeNull();
    expect(testOutput?.foodDonor).toEqual("Jamie");
    expect(testOutput?.waitlistStatus).toEqual(WaitlistStatus.MATCHED);
  });

  it("Can remove the foodDonor of Citizen", async () => {
    await waitlistDao.createCitizenOnWaitlist(testUser1);
    const testOutput = await waitlistDao.updateCitizenOnWaitlist(
      testUser1.username,
      "Jamie"
    );
    expect(testOutput?.waitlistStatus).toEqual(WaitlistStatus.MATCHED);

    const testOutput2 = await waitlistDao.updateCitizenOnWaitlist(
      testUser1.username,
      ""
    );
    expect(testOutput2).not.toBeNull();
    expect(testOutput2?.foodDonor).toEqual("");
    expect(testOutput2?.waitlistStatus).toEqual(WaitlistStatus.PENDING);
  });
});

describe("removeCitizenFromWaitlist", () => {
  it("Should remove User properly", async () => {
    const testOutput1 = await waitlistDao.createCitizenOnWaitlist(testUser1);
    expect(testOutput1).not.toBeNull();
    await waitlistDao.removeCitizenFromWaitlist(testUser1);
    const testOutput2 = await waitlistDao.getCitizenInfoByUsername(
      testUser1.username
    );
    expect(testOutput2).toBeNull();
  });
});
