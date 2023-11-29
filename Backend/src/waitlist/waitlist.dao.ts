import { In, Like, Repository } from "typeorm";
import { WaitlistUser } from "./waitlist.entity";
import { WaitlistStatus } from "./waitlistStatus";
import ESNDatabase from "../database/ESNDatabase";

export default class WaitlistDAO {
  private waitlistUserDatabase: Repository<WaitlistUser>;

  constructor() {
    this.waitlistUserDatabase = ESNDatabase.getDatabaseInstance()
      .getDataSource()
      .getRepository(WaitlistUser);
  }

  async createCitizenOnWaitlist(citizen: WaitlistUser): Promise<WaitlistUser> {
    const createdWaitlistUser = await this.waitlistUserDatabase.save(citizen);
    return createdWaitlistUser;
  }

  async getAllCitizensInfo(): Promise<WaitlistUser[]> {
    const allUsers = await this.waitlistUserDatabase.find({});
    return allUsers;
  }

  async getCitizenInfoByUsername(
    username: string
  ): Promise<WaitlistUser | null> {
    return await this.waitlistUserDatabase.findOneBy({
      username,
    });
  }

  async updateCitizenOnWaitlist(
    username: string,
    foodDonorUsername: string
  ): Promise<WaitlistUser | null> {
    const userToUpdate = await this.waitlistUserDatabase.findOneBy({
      username,
    });
    if (userToUpdate) {
      // Update user properties
      if (foodDonorUsername) {
        userToUpdate.foodDonor = foodDonorUsername;
        userToUpdate.waitlistStatus = WaitlistStatus.MATCHED;
      } else {
        userToUpdate.foodDonor = "";
        userToUpdate.waitlistStatus = WaitlistStatus.PENDING;
      }

      // Save the updated user
      await this.waitlistUserDatabase.save(userToUpdate);
    }
    return userToUpdate;
  }

  async removeCitizenFromWaitlist(user: WaitlistUser): Promise<void> {
    if (user) {
      // If user exists, remove them
      await this.waitlistUserDatabase.remove(user);
    }
  }
}
