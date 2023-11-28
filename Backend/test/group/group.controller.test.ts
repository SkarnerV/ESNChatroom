import GroupController from "../../src/group/group.controller";
import ESNDatabase from "../../src/database/ESNDatabase";

const databaseInstance = ESNDatabase.getDatabaseInstance();

describe("GroupController", () => {
  let groupController: GroupController;

  beforeEach(async () => {
    databaseInstance.setTestDatabase();
    await databaseInstance.getDataSource().initialize();
    groupController = new GroupController();
  });

  afterEach(async () => {
    await databaseInstance.getDataSource().destroy();
  });

  describe("getAllGroups", () => {
    it("should get no groups when first called", async () => {
      const groups = await groupController.getAllGroups();
      expect(groups).toEqual([]);
    });
  });

  describe("createGroup", () => {
    it("should create a group with the provided parameters", async () => {
      const name = "Test Group";
      const description = "Test Description";
      const group = await groupController.createGroup(name, description);
      expect(group!.name).toEqual(name);
      expect(group!.description).toEqual(description);
    });
  });

  describe("updateGroup", () => {
    it("should update a group with the provided parameters", async () => {
      const name = "Initial Group";
      const description = "Initial Description";
      const createdGroup = await groupController.createGroup(name, description);

      const newName = "Updated Group";
      const newDescription = "Updated Description";
      const updatedGroup = await groupController.updateGroup(
        name,
        newName,
        newDescription
      );

      expect(updatedGroup.name).toEqual(newName);
      expect(updatedGroup.description).toEqual(newDescription);
    });
  });

  describe("deleteGroup", () => {
    it("should delete a group and return an empty array after deletion", async () => {
      const name = "Group to Delete";
      const description = "Description";
      const createdGroup = await groupController.createGroup(name, description);

      await groupController.deleteGroup(name);
      const groups = await groupController.getAllGroups();

      expect(groups).toEqual([]);
    });
  });
});
