import GroupDao from "./group.dao";

export default class GroupController {
  private groupDao: GroupDao;

  constructor() {
    this.groupDao = new GroupDao();
  }

  async getAllGroups() {
    return await this.groupDao.getAllGroups();
  }

  async createGroup(name: string, description: string) {
    return await this.groupDao.createGroup(name, description);
  }

  async updateGroup(
    currentName: string,
    newName: string,
    newDescription: string
  ) {
    const group = await this.groupDao.updateGroup(
      currentName,
      newName,
      newDescription
    );
    if (!group) {
      throw new Error("Group not found");
    }
    return group;
  }

  async deleteGroup(name: string) {
    const group = await this.groupDao.deleteGroup(name);
    if (!group) {
      throw new Error("Group not found");
    }
    return group;
  }
}
