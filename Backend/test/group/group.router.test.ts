import request from "supertest";
import express, { Express } from "express";
import GroupRouter from "../../src/group/group.router";
import { Group } from "../../src/group/group.entity";
import bodyParser from "body-parser";
import ESNDatabase from "../../src/database/ESNDatabase";

let app: Express;
let groupRouter: GroupRouter;
const databaseInstance: ESNDatabase = ESNDatabase.getDatabaseInstance();

const testGroup: Group = {
  id: 1,
  name: "test_group",
  description: "test_description",
} as Group;

beforeEach(async () => {
  app = express();
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  groupRouter = new GroupRouter();
  app.use(bodyParser.json());
  app.use(express.json());
  app.use("/api/groups", groupRouter.getRouter());
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("GroupRouter", () => {
  describe("GET /", () => {
    it("should get all groups", async () => {
      const res = await request(app).get("/api/groups").expect(200);
      expect(res.body).toEqual([]);
    });

    it("should return 404 for a non-existent group", async () => {
      const response = await request(app).get("/api/groups/99999"); // Assuming this ID does not exist
      expect(response.statusCode).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should create a group", async () => {
      const res = await request(app)
        .post("/api/groups")
        .send(testGroup)
        .expect(201);
      expect(res.body.name).toEqual(testGroup.name);
      expect(res.body.description).toEqual(testGroup.description);

      const res2 = await request(app).get("/api/groups").expect(200);
      expect(res2.body).toEqual([testGroup]);
    });

    it("should create a new group", async () => {
      const groupData = {
        name: "New Group",
        description: "New Group Description",
      };
      const response = await request(app).post("/api/groups").send(groupData);
      expect(response.statusCode).toBe(201);
      expect(response.body.name).toEqual(groupData.name);
    });
  });

  describe("PUT /", () => {
    it("should update a group", async () => {
      const postRes = await request(app)
        .post("/api/groups")
        .send(testGroup)
        .expect(201);

      const updatedGroup = {
        ...testGroup,
        name: "updated_name",
        description: "updated_description",
      };
      const putRes = await request(app)
        .put(`/api/groups`)
        .send({
          name: "updated_name",
          description: "updated_description",
        })
        .expect(200);

      expect(putRes.body.name).toEqual(updatedGroup.name);
      expect(putRes.body.description).toEqual(updatedGroup.description);
    });
  });

  describe("DELETE /", () => {
    it("should delete a group", async () => {
      const postRes = await request(app)
        .post("/api/groups")
        .send(testGroup)
        .expect(201);

      const response = await request(app)
        .delete("/api/groups")
        .send({ name: "test_group" });

      expect(response.status).toBe(200);

      const getRes = await request(app).get("/api/groups").expect(200);
      expect(getRes.body).toEqual([]);
    });
  });
});
