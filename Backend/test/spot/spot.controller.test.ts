import SpotController from "../../src/spot/spot.controller";
import ESNDatabase from "../../src/database/ESNDatabase";

const databaseInstance = ESNDatabase.getDatabaseInstance();

describe("SpotController", () => {
  let spotController: SpotController;

  beforeEach(async() => {
    databaseInstance.setTestDatabase();
    await databaseInstance.getDataSource().initialize();
    spotController = new SpotController();
  });

  afterEach(async () => {
    await databaseInstance.getDataSource().destroy();
  });

  describe("getAllSpot", () => {
    it("should get no elements when first call", async () => {
      const spots = await spotController.getAllSpot();
      expect(spots).toEqual([]);
    });
  });

  describe("createSpot", () => {
    it("should call createSpot method of SpotDAO with the provided parameters", async () => {
      const info = "test info";
      const latitude = 123.456;
      const longitude = 789.012;
      const username = "testuser";
      const res = await spotController.createSpot(info, latitude, longitude, username);
      expect(res.username).toEqual(username);
    });
  });

  describe("updateSpot", () => {
    it("should call updateSpot method of SpotDAO with the provided parameters", async () => {
      const info = "test info";
      const latitude = 123.456;
      const longitude = 789.012;
      const username = "testuser";
      await spotController.createSpot(info, latitude, longitude, username);
      const id = 1;
      const newInfo = "updated info";
      const res = await spotController.updateSpot(id, newInfo);
      expect(res?.info).toEqual(newInfo);
    });
  });

  describe("deleteSpot", () => {
    it("should call deleteSpot method of SpotDAO with the provided id", async () => {
      const info = "test info";
      const latitude = 123.456;
      const longitude = 789.012;
      const username = "testuser";
      await spotController.createSpot(info, latitude, longitude, username);
      const id = 1;
      await spotController.deleteSpot(id);
      const spots = await spotController.getAllSpot();
      expect(spots).toEqual([]);
    });
  });
});