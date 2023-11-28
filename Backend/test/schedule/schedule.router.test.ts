import request from "supertest";
import bodyParser from "body-parser";
import express, { Express, Router } from "express";
import ESNDatabase from "../../src/database/ESNDatabase";
import ScheduleController from "../../src/schedule/schedule.controller";
import { FoodSharingSchedule } from "../../src/schedule/schedule.entity";
import ScheduleRouter from "../../src/schedule/schedule.router";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let scheduleRouter: Router;
let app: Express;
let scheduleController: ScheduleController;

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
  app = express();
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  app.use(bodyParser.json());
  scheduleController = new ScheduleController();
  scheduleRouter = new ScheduleRouter().getRouter();
  app.use("/api/schedules", scheduleRouter);
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("ScheduleRouter", () => {
  describe("POST /", () => {
    it("should post a schedule made between scheduler and schedulee", async () => {
      const res = await request(app)
        .post("/api/schedules")
        .send(testSchedule1)
        .expect(200);

      expect(res.body.scheduleid).toEqual(testSchedule1.scheduleid);
      expect(res.body.time).toEqual(testSchedule1.time);
      expect(res.body.status).toEqual(testSchedule1.status);

      //verify with GET
      let user1 = testSchedule1.scheduler;
      let user2 = testSchedule1.schedulee;
      const res1 = await request(app)
        .get(`/api/schedules/${user1}/${user2}`)
        .send()
        .expect(200);
      expect(
        res1.body.map((schedule: FoodSharingSchedule) => schedule.scheduleid)
      ).toEqual([testSchedule1.scheduleid]);
    });
  });

  describe("GET /:scheduler/:schedulee", () => {
    it("should get all schedules between scheduler and schedulee", async () => {
      await scheduleController.postSharingSchedule(testSchedule1);
      await scheduleController.postSharingSchedule(testSchedule2);

      let user1 = "1";
      let user2 = "2";
      const res = await request(app)
        .get(`/api/schedules/${user1}/${user2}`)
        .expect(200);

      expect(
        res.body.map((schedule: FoodSharingSchedule) => schedule.scheduleid)
      ).toEqual([testSchedule1.scheduleid, testSchedule2.scheduleid]);
    });
  });
});

describe("PUT /:scheduleid", () => {
  it("should update the schedule with new status", async () => {
    await scheduleController.postSharingSchedule(testSchedule1);

    let scheduleid = testSchedule1.scheduleid;
    const res = await request(app)
      .put(`/api/schedules/${scheduleid}`)
      .send({ status: "Accept" })
      .expect(200);

    expect(res.body.data.status).toEqual("Accept");
  });

  it("should get an error updating schedule does not exist", async () => {
    await scheduleController.postSharingSchedule(testSchedule1);

    let badscheduleid = "badtestid";
    const res = await request(app)
      .put(`/api/schedules/${badscheduleid}`)
      .send({ status: "Accept" })
      .expect(404);

    expect(res.body).toEqual({
      message: "Schedule not found",
    });
  });

  describe("DELETE /deletion/:scheduleid", () => {
    it("should delete the schedule with the scheduleid", async () => {
      await scheduleController.postSharingSchedule(testSchedule1);

      let scheduleid = testSchedule1.scheduleid;
      const res = await request(app)
        .delete(`/api/schedules/deletion/${scheduleid}`)
        .expect(200);

      expect(res.body.data).toEqual(testSchedule1.scheduleid);
    });

    it("should get an error deleting schedule does not exist", async () => {
      await scheduleController.postSharingSchedule(testSchedule1);

      let badscheduleid = "badtestid2";
      const res = await request(app)
        .delete(`/api/schedules/deletion/${badscheduleid}`)
        .expect(404);

      expect(res.body).toEqual({
        message: "Schedule not found",
      });
    });
  });
});
