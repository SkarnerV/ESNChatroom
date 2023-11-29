import SpotDAO from "../../src/spot/spot.dao";
import ESNDatabase from "../../src/database/ESNDatabase";
import { Spot } from "../../src/spot/spot.entity";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let spotDAO: SpotDAO;

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  spotDAO = new SpotDAO();
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("SpotDAO", () => {
  describe("getAllSpot", () => {
    it("should return all spots", async () => {
      // Create test spots
      const spot1 = new Spot();
      spot1.info = "Spot 1";
      spot1.latitude = 1.234;
      spot1.longitude = 5.678;
      spot1.username = "user1";
      spot1.lastUpdateTime = new Date().toISOString();
      await spotDAO.createSpot(spot1.info, spot1.latitude, spot1.longitude, spot1.username);

      const spot2 = new Spot();
      spot2.info = "Spot 2";
      spot2.latitude = 9.876;
      spot2.longitude = 3.210;
      spot2.username = "user2";
      spot2.lastUpdateTime = new Date().toISOString();
      await spotDAO.createSpot(spot2.info, spot2.latitude, spot2.longitude, spot2.username);

      // Get all spots
      const spots = await spotDAO.getAllSpot();

      // Assertions
      expect(spots).toBeInstanceOf(Array);
      expect(spots).toHaveLength(2);
      expect(spots[0]).toBeInstanceOf(Spot);
      expect(spots[0].info).toEqual(spot1.info);
      expect(spots[0].latitude).toEqual(spot1.latitude);
      expect(spots[0].longitude).toEqual(spot1.longitude);
      expect(spots[0].username).toEqual(spot1.username);
      expect(spots[1]).toBeInstanceOf(Spot);
      expect(spots[1].info).toEqual(spot2.info);
      expect(spots[1].latitude).toEqual(spot2.latitude);
      expect(spots[1].longitude).toEqual(spot2.longitude);
      expect(spots[1].username).toEqual(spot2.username);
    });

    it("should return empty list if no spot", async () => {
      // Get all spots
      const spots = await spotDAO.getAllSpot();

      // Assertions
      expect(spots).toBeInstanceOf(Array);
      expect(spots).toHaveLength(0);
    });
  });

  describe("createSpot", () => {
    it("should create a new spot", async () => {
      // Create a new spot
      const info = "New Spot";
      const latitude = 1.234;
      const longitude = 5.678;
      const username = "user1";
      const spot = await spotDAO.createSpot(info, latitude, longitude, username);

      // Assertions
      expect(spot).toBeInstanceOf(Spot);
      expect(spot.info).toEqual(info);
      expect(spot.latitude).toEqual(latitude);
      expect(spot.longitude).toEqual(longitude);
      expect(spot.username).toEqual(username);
      expect(spot.lastUpdateTime).toBeDefined();
    });
  });

  describe("updateSpot", () => {
    it("should update an existing spot", async () => {
      // Create a new spot
      const info = "Spot";
      const latitude = 1.234;
      const longitude = 5.678;
      const username = "user1";
      const spot = await spotDAO.createSpot(info, latitude, longitude, username);

      // Update the spot
      const newInfo = "Updated Spot";
      const updatedSpot = await spotDAO.updateSpot(spot.id, newInfo);

      // Assertions
      expect(updatedSpot).toBeInstanceOf(Spot);
      expect(updatedSpot!.info).toEqual(newInfo);
      expect(updatedSpot!.latitude).toEqual(latitude);
      expect(updatedSpot!.longitude).toEqual(longitude);
      expect(updatedSpot!.username).toEqual(username);
      expect(updatedSpot!.lastUpdateTime).toBeDefined();
    });

    it("should return null if spot does not exist", async () => {
      // Update a non-existent spot
      const spotId = 123;
      const newInfo = "Updated Spot";
      const updatedSpot = await spotDAO.updateSpot(spotId, newInfo);

      // Assertion
      expect(updatedSpot).toBeNull();
    });
  });

  describe("deleteSpot", () => {
    it("should delete an existing spot", async () => {
      // Create a new spot
      const info = "Spot";
      const latitude = 1.234;
      const longitude = 5.678;
      const username = "user1";
      const spot = await spotDAO.createSpot(info, latitude, longitude, username);

      // Delete the spot
      const deletedSpot = await spotDAO.deleteSpot(spot.id);

      // Assertions
      expect(deletedSpot).toBeInstanceOf(Spot);
      expect(deletedSpot!.info).toEqual(info);
      expect(deletedSpot!.latitude).toEqual(latitude);
      expect(deletedSpot!.longitude).toEqual(longitude);
      expect(deletedSpot!.username).toEqual(username);
      expect(deletedSpot!.lastUpdateTime).toBeDefined();
    });

    it("should return null if spot does not exist", async () => {
      // Delete a non-existent spot
      const spotId = 123;
      const deletedSpot = await spotDAO.deleteSpot(spotId);

      // Assertion
      expect(deletedSpot).toBeNull();
    });

    it("should not change the number of spots if delete non-existing spot", async () => {
      // Create a new spot
      const info = "Spot";
      const latitude = 1.234;
      const longitude = 5.678;
      const username = "user1";
      await spotDAO.createSpot(info, latitude, longitude, username);
      
      // Delete a non-existent spot
      const spotId = 123;
      await spotDAO.deleteSpot(spotId);
      expect(await spotDAO.getAllSpot()).toHaveLength(1);
    });
  });
});