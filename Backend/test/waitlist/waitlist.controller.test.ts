import ESNDatabase from "../../src/database/ESNDatabase";
import WaitlistController from "../../src/waitlist/waitlist.controller";
import { WaitlistStatus } from "../../src/waitlist/waitlistStatus";
import { waitlistUserInput } from "../../src/types/types";
import { Exception, StatusCode } from "../../src/util/exception";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let waitlistController: WaitlistController;

const testUserInput1: waitlistUserInput = {
  username: "aaa1",
  foodComments: "One piece of bread and one bottle of water.",
};

const testUserInput2: waitlistUserInput = {
  username: "aaa2",
  foodComments: "I need some pizza.",
};

const testUserInput3: waitlistUserInput = {
  username: "",
  foodComments: "I need 3 pizza.",
};

const testUserInput4: waitlistUserInput = {
  username: "aaa4",
  foodComments: "",
};

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  waitlistController = new WaitlistController();
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("putCitizenOnWaitlist", () => {
  it("Should create the citizen on the waitlist", async () => {
    const createdWaitlistUser =
      await waitlistController.putCitizenOnWaitlist(testUserInput1);

    expect(createdWaitlistUser).not.toBeNull();
    expect(createdWaitlistUser?.username).toEqual(testUserInput1.username);
    expect(createdWaitlistUser?.foodComments).toEqual(
      testUserInput1.foodComments
    );
    expect(createdWaitlistUser?.foodDonor).toEqual("");
    expect(createdWaitlistUser?.waitlistStatus).toEqual(WaitlistStatus.PENDING);
  });

  it("Should throw error if username is missing", async () => {
    try {
      await waitlistController.putCitizenOnWaitlist(testUserInput3);
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.BAD_REQUEST_CODE);
    }
  });

  it("Should throw error if food comment is missing", async () => {
    try {
      await waitlistController.putCitizenOnWaitlist(testUserInput4);
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.BAD_REQUEST_CODE);
    }
  });
});

describe("getAllCitizensInfoOnWaitlist", () => {
  it("Should return empty users if no users exist", async () => {
    const allUsers = await waitlistController.getAllCitizensInfoOnWaitlist();
    expect(allUsers).not.toBeNull();
    expect(allUsers).toEqual([]);
  });

  it("Should return all users' info", async () => {
    const testOutput1 =
      await waitlistController.putCitizenOnWaitlist(testUserInput1);
    const testOutput2 =
      await waitlistController.putCitizenOnWaitlist(testUserInput2);

    const allUsers = await waitlistController.getAllCitizensInfoOnWaitlist();
    expect(allUsers).not.toBeNull();
    expect(allUsers).toEqual([testOutput1, testOutput2]);
  });
});

describe("getCitizenInfoOnWaitlistByUsername", () => {
  it("Should return null if user not exists", async () => {
    try {
      await waitlistController.getCitizenInfoOnWaitlistByUsername("bbb1");
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.NOT_FOUND_CODE);
    }
  });

  it("Should return null if user not exists", async () => {
    const testOutput1 =
      await waitlistController.putCitizenOnWaitlist(testUserInput1);
    const testOutput2 =
      await waitlistController.getCitizenInfoOnWaitlistByUsername(
        testOutput1.username
      );
    expect(testOutput2).not.toBeNull();
    expect(testOutput2).toEqual(testOutput1);
  });
});

describe("updateCitizenWaitStatus", () => {
  it("Should return null if user not exists", async () => {
    try {
      await waitlistController.updateCitizenWaitStatus("bbb1", "");
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.NOT_FOUND_CODE);
    }
  });

  it("Can change the foodDonor of Citizen", async () => {
    const testOutput1 =
      await waitlistController.putCitizenOnWaitlist(testUserInput1);
    const testOutput2 = await waitlistController.updateCitizenWaitStatus(
      testOutput1.username,
      "Jamie"
    );
    expect(testOutput2).not.toBeNull();
    expect(testOutput2?.foodDonor).toEqual("Jamie");
    expect(testOutput2?.waitlistStatus).toEqual(WaitlistStatus.MATCHED);
  });

  it("Can remove the foodDonor of Citizen", async () => {
    await waitlistController.putCitizenOnWaitlist(testUserInput1);
    const testOutput1 = await waitlistController.updateCitizenWaitStatus(
      testUserInput1.username,
      "Jamie"
    );
    expect(testOutput1).not.toBeNull();
    expect(testOutput1?.foodDonor).toEqual("Jamie");
    expect(testOutput1?.waitlistStatus).toEqual(WaitlistStatus.MATCHED);

    await waitlistController.putCitizenOnWaitlist(testUserInput1);
    const testOutput2 = await waitlistController.updateCitizenWaitStatus(
      testUserInput1.username,
      ""
    );
    expect(testOutput2).not.toBeNull();
    expect(testOutput2?.foodDonor).toEqual("");
    expect(testOutput2?.waitlistStatus).toEqual(WaitlistStatus.PENDING);
  });
});

describe("deleteUserByUsername", () => {
  it("Should remove User properly", async () => {
    const testOutput1 =
      await waitlistController.putCitizenOnWaitlist(testUserInput1);
    expect(testOutput1).not.toBeNull();
    await waitlistController.deleteUserByUsername(testOutput1.username);

    try {
      await waitlistController.getCitizenInfoOnWaitlistByUsername(
        testOutput1.username
      );
    } catch (error) {
      expect((error as Exception).status).toEqual(StatusCode.NOT_FOUND_CODE);
    }
  });
});
