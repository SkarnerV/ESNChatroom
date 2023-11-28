import ESNDatabase from "../../src/database/ESNDatabase";
import ScheduleDAO from "../../src/schedule/schedule.dao";
import { FoodSharingSchedule } from "../../src/schedule/schedule.entity";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let scheduleDao: ScheduleDAO;
const testSchedule1: FoodSharingSchedule = {
  scheduleid: "testid1",
  scheduler: "1",
  schedulee: "2",
  time: "2023-11-16_21:00",
  status: "Pending",
};
const testSchedule2: FoodSharingSchedule = {
  scheduleid: "testid2",
  scheduler: "1",
  schedulee: "2",
  time: "2023-11-16_21:05",
  status: "Pending",
};

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  scheduleDao = new ScheduleDAO();
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("postSchedule", () => {
  it("Should create a new schedule and save in the schedule database", async () => {
    const createdSchedule1 = await scheduleDao.createSchedule(testSchedule1);
    const createdSchedule2 = await scheduleDao.createSchedule(testSchedule2);

    expect(createdSchedule1.scheduleid).toEqual(testSchedule1.scheduleid);

    expect(createdSchedule2.scheduleid).toEqual(testSchedule2.scheduleid);
  });
});

describe("getAllSchedules", () => {
  it("Should return all the schedules created and saved in the schedule database", async () => {
    await scheduleDao.createSchedule(testSchedule1);
    await scheduleDao.createSchedule(testSchedule2);

    const allMessages = await scheduleDao.getAllSchedules("1", "2");

    expect(allMessages.map((schedule) => schedule.scheduleid)).toEqual([
      testSchedule1.scheduleid,
      testSchedule2.scheduleid,
    ]);
  });
});

describe("updateSchedule", () => {
  it("Should update the schedule status with the passed in new status - Accept", async () => {
    await scheduleDao.createSchedule(testSchedule1);
    await scheduleDao.createSchedule(testSchedule2);

    const updatedResult = await scheduleDao.updateSelectedSchedule(
      testSchedule1.scheduleid,
      "Accept"
    );

    expect(updatedResult!.status).toEqual("Accept");
  });

  it("Should update the schedule status with the passed in new status - Reject", async () => {
    await scheduleDao.createSchedule(testSchedule1);
    await scheduleDao.createSchedule(testSchedule2);

    const updatedResult = await scheduleDao.updateSelectedSchedule(
      testSchedule2.scheduleid,
      "Reject"
    );

    expect(updatedResult!.status).toEqual("Reject");
  });

  it("Should get null result when scheduleid not exist", async () => {
    await scheduleDao.createSchedule(testSchedule1);
    await scheduleDao.createSchedule(testSchedule2);

    await expect(
      scheduleDao.updateSelectedSchedule("testid3", "Reject")
    ).rejects.toThrow("Schedule not found");
  });
});

describe("deleteSchedule", () => {
  it("Should return all the schedules created and saved in the schedule database", async () => {
    await scheduleDao.createSchedule(testSchedule1);
    await scheduleDao.createSchedule(testSchedule2);

    const deletedSchedule = await scheduleDao.deleteSelectedSchedule(
      testSchedule1.scheduleid
    );

    expect(deletedSchedule.scheduleid).toEqual(testSchedule1.scheduleid);
  });

  it("Should get an error deleting schedule does not exist", async () => {
    await scheduleDao.createSchedule(testSchedule1);
    await scheduleDao.createSchedule(testSchedule2);

    await expect(scheduleDao.deleteSelectedSchedule("testid3")).rejects.toThrow(
      "Schedule not found"
    );
  });
});
