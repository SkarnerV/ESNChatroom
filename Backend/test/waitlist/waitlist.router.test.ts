import ESNDatabase from "../../src/database/ESNDatabase";
import WaitlistRouter from "../../src/waitlist/waitlist.router";
import { WaitlistStatus } from "../../src/waitlist/waitlistStatus";
import { WaitlistUser } from "../../src/waitlist/waitlist.entity";
import WaitlistDAO from "../../src/waitlist/waitlist.dao";
import request from "supertest";
import bodyParser from "body-parser";
import express, { Express, Router } from "express";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let waitlistRouter: Router;
let waitlistDAO: WaitlistDAO;
let app: Express;

const defaultWaitlistUser = {
  id: null,
  username: "",
  waitlistStatus: WaitlistStatus.MATCHED,
  foodDonor: "Jamie",
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
  app = express();
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  waitlistRouter = new WaitlistRouter().getRouter();
  waitlistDAO = new WaitlistDAO();
  await waitlistDAO.createCitizenOnWaitlist(testUser1);
  await waitlistDAO.createCitizenOnWaitlist(testUser2);
  app.use(bodyParser.json());
  app.use("/api/waitlist", waitlistRouter);
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("WaitlistRouter", () => {
  describe("GET /allCitizens", () => {
    it("should get all users info", async () => {
      const res = await request(app)
        .get("/api/waitlist/allCitizens")
        .send()
        .expect(200);

      expect(res.body).toEqual([testUser1, testUser2]);
    });
  });

  describe("GET /:citizen", () => {
    it("should get user info by inputting username", async () => {
      const username = testUser1.username;
      const res = await request(app)
        .get(`/api/waitlist/${username}`)
        .send()
        .expect(200);

      expect(res.body).toEqual(testUser1);
    });
  });

  describe("PUT /:citizen", () => {
    it("should update specific user status", async () => {
      const requestBody = {
        username: testUser1.username,
        foodDonor: "Jamie",
      };
      const res = await request(app)
        .put(`/api/waitlist/${testUser1.username}`)
        .send(requestBody)
        .expect(200);
      // verify with GET
      const res1 = await request(app)
        .get(`/api/waitlist/${testUser1.username}`)
        .send()
        .expect(200);
      expect(res1.body.foodDonor).toEqual(testUser1.foodDonor);
    });
  });

  describe("POST /:citizen", () => {
    it("should create a waitlist user", async () => {
      const requestBody = {
        username: testUser1.username,
        foodComments: testUser1.foodComments,
      };
      const res1 = await request(app)
        .post(`/api/waitlist/`)
        .send(requestBody)
        .expect(200);

      expect(res1.body.foodComments).toEqual(testUser1.foodComments);
    });
  });

  describe("DELETE /:citizen", () => {
    it("should delete a User", async () => {
      await request(app)
        .delete(`/api/waitlist/${testUser1.username}`)
        .send()
        .expect(200);
    });
  });
});
