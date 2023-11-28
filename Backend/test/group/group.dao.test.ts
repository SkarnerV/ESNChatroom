import GroupDao from "../../src/group/group.dao";
import ESNDatabase from "../../src/database/ESNDatabase";
import { Group } from "../../src/group/group.entity";

const databaseInstance = ESNDatabase.getDatabaseInstance();
let groupDao: GroupDao;

beforeEach(async () => {
  databaseInstance.setTestDatabase();
  await databaseInstance.getDataSource().initialize();
  groupDao = new GroupDao();
});

afterEach(async () => {
  await databaseInstance.getDataSource().destroy();
});

describe("GroupDao", () => {
  describe("getAllGroups", () => {
    it("should return all groups", async () => {
      // Create test groups
      const group1 = new Group();
      group1.name = "Group 1";
      group1.description = "Description 1";
      await groupDao.createGroup(group1.name, group1.description);

      const group2 = new Group();
      group2.name = "Group 2";
      group2.description = "Description 2";
      await groupDao.createGroup(group2.name, group2.description);

      // Get all groups
      const groups = await groupDao.getAllGroups();

      // Assertions
      expect(groups).toBeInstanceOf(Array);
      expect(groups).toHaveLength(2);
      expect(groups[0]).toBeInstanceOf(Group);
      expect(groups[0].name).toEqual(group1.name);
      expect(groups[0].description).toEqual(group1.description);
      expect(groups[1].name).toEqual(group2.name);
      expect(groups[1].description).toEqual(group2.description);
    });
  });

  describe("createGroup", () => {
    it("should create a new group", async () => {
      // Create a new group
      const name = "New Group";
      const description = "New Group Description";
      const group = await groupDao.createGroup(name, description);

      // Assertions
      expect(group).toBeInstanceOf(Group);
      expect(group!.name).toEqual(name);
      expect(group!.description).toEqual(description);
    });
  });

  describe("updateGroup", () => {
    it("should update an existing group", async () => {
      // Create a new group
      const name = "Group";
      const description = "Group Description";
      const group = await groupDao.createGroup(name, description);

      // Update the group
      const newName = "Updated Group";
      const newDescription = "Updated Description";
      const updatedGroup = await groupDao.updateGroup(
        "Group",
        newName,
        newDescription
      );

      // Assertions
      expect(updatedGroup).toBeInstanceOf(Group);
      expect(updatedGroup!.name).toEqual(newName);
      expect(updatedGroup!.description).toEqual(newDescription);
    });

    it("should return null if group does not exist", async () => {
      // Update a non-existent group
      const newName = "Updated Group";
      const newDescription = "Updated Description";
      const updatedGroup = await groupDao.updateGroup(
        "Group",
        newName,
        newDescription
      );

      // Assertion
      expect(updatedGroup).toBeNull();
    });
  });

  describe("deleteGroup", () => {
    it("should delete an existing group", async () => {
      // Create a new group
      const name = "Group";
      const description = "Group Description";
      const group = await groupDao.createGroup(name, description);

      // Delete the group
      const deletedGroup = await groupDao.deleteGroup(name);

      // Assertions
      expect(deletedGroup).toBeInstanceOf(Group);
      expect(deletedGroup!.name).toEqual(name);
      expect(deletedGroup!.description).toEqual(description);
    });

    it("should return null if group does not exist", async () => {
      // Delete a non-existent group
      const groupName = "123";
      const deletedGroup = await groupDao.deleteGroup(groupName);

      // Assertion
      expect(deletedGroup).toBeNull();
    });
  });
});
