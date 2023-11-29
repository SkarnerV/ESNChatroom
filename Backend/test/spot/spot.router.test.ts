import request from "supertest";
import express, { Express } from "express";
import SpotRouter from "../../src/spot/spot.router";
import { Spot } from "../../src/spot/spot.entity";
import bodyParser from "body-parser";
import ESNDatabase from "../../src/database/ESNDatabase";


let app: Express;
let spotRouter: SpotRouter;
const databaseInstance: ESNDatabase = ESNDatabase.getDatabaseInstance();

const testSpot: Spot = {
  id: 1,
  info: "test_info",
  latitude: 0,
  longitude: 0,
  username: "test_username",
} as Spot;

beforeEach(async() => {
  app = express();
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  spotRouter = new SpotRouter();
  app.use(bodyParser.json());
  app.use(express.json());
  app.use("/api/spots", spotRouter.getRouter());
});

afterEach(async() => {
  await databaseInstance.getDataSource().destroy();
});

describe("SpotRouter", () => {
  describe("GET /", () => {
    it("should get empty list if no input", async () => {
      const res = await request(app).get("/api/spots").expect(200);
      expect(res.body).toEqual([]);
    });

    it("should get all spots", async () => {
      await request(app)
        .post("/api/spots")
        .send(testSpot)
        .expect(200);
      await request(app)
        .post("/api/spots")
        .send(testSpot)
        .expect(200);
      await request(app)
        .post("/api/spots")
        .send(testSpot)
        .expect(200);
      const res = await request(app).get("/api/spots").expect(200);
      expect(res.body.length).toEqual(3);
    });
  });

  describe("POST /", () => {
    it("should create a spot", async () => {
      const res = await request(app)
        .post("/api/spots")
        .send(testSpot)
        .expect(200);
      expect(res.body.username).toEqual(testSpot.username);
    });
  });

  describe("PUT /", () => {
    it("should update a spot", async () => {
      await request(app)
        .post("/api/spots")
        .send(testSpot)
        .expect(200);
      const updatedSpot = { ...testSpot, info: "updated_info" };
      const res = await request(app)
        .put("/api/spots")
        .send(updatedSpot)
        .expect(200);
      expect(res.body.info).toEqual(updatedSpot.info);
    });
  });

  describe("DELETE /", () => {
    it("should do nothing if spot does not exist", async () => {
      await request(app)
        .delete("/api/spots")
        .send({ id: testSpot.id })
        .expect(200);
      const res = await request(app).get("/api/spots").expect(200);
      expect(res.body).toEqual([]);
    });

    it("should delete a spot", async () => {
      await request(app)
        .post("/api/spots")
        .send(testSpot)
        .expect(200);
      await request(app)
        .delete("/api/spots")
        .send({ id: testSpot.id })
        .expect(200);
      const res = await request(app).get("/api/spots").expect(200);
      expect(res.body).toEqual([]);
    });
  });
});