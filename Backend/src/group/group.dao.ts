import { Repository } from "typeorm";
import ESNDatabase from "../database/ESNDatabase";
import { Group } from "./group.entity";

export default class GroupDao {
  private groupRepository: Repository<Group>;

  constructor() {
    this.groupRepository = ESNDatabase.getDatabaseInstance()
      .getDataSource()
      .getRepository(Group);
  }

  async getAllGroups() {
    return await this.groupRepository.find({
      select: ["id", "name", "description"],
    });
  }

  async createGroup(name: string, description: string) {
    const existingGroup = await this.groupRepository.findOne({
      where: { name: name },
    });
    if (existingGroup) {
      return null;
    }
    const group = new Group();
    group.name = name;
    group.description = description;
    return await this.groupRepository.save(group);
  }

  async updateGroup(
    currentName: string,
    newName: string,
    newDescription: string
  ) {
    // Find the group by its current name (or another unique identifier)

    const group = await this.groupRepository.findOne({
      where: { name: currentName },
    });

    if (!group) {
      return null;
      // Alternatively, you can return null or handle this case as per your application's logic
    }

    // Update the group's name and description
    group.name = newName;
    group.description = newDescription;

    // Save the updated group back to the database
    return await this.groupRepository.save(group);
  }

  async deleteGroup(name: string) {
    const group = await this.groupRepository.findOne({ where: { name: name } });
    if (!group) {
      return null;
    }
    return await this.groupRepository.remove(group);
  }
}
