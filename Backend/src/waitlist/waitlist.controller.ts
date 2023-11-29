import {
  BadRequestException,
  ErrorMessage,
  NotFoundException,
} from "../util/exception";
import WaitlistDAO from "./waitlist.dao";
import { WaitlistStatus } from "./waitlistStatus";
import { WaitlistUser } from "./waitlist.entity";
import { SocketServer } from "../server/socketServer";
import { waitlistUserInput } from "../types/types";

export default class WaitlistController {
  private waitlistDao: WaitlistDAO;
  constructor() {
    this.waitlistDao = new WaitlistDAO();
  }

  async putCitizenOnWaitlist(
    citizen: waitlistUserInput
  ): Promise<WaitlistUser> {
    if (!citizen.foodComments) {
      throw new BadRequestException(
        ErrorMessage.MISSING_FOOD_COMMENTS_ON_WAITLIST
      );
    }
    if (!citizen.username) {
      throw new BadRequestException(ErrorMessage.MISSING_USERNAME);
    }
    const newCitizen: WaitlistUser = new WaitlistUser();
    newCitizen.username = citizen.username;
    newCitizen.foodComments = citizen.foodComments;
    newCitizen.foodDonor = "";
    newCitizen.waitlistStatus = WaitlistStatus.PENDING;
    newCitizen.joinTime = new Date().getTime().toString();

    const createdWaitlistUser =
      await this.waitlistDao.createCitizenOnWaitlist(newCitizen);

    SocketServer.getInstance().broadcastNewWaitlistUser(createdWaitlistUser);

    return createdWaitlistUser;
  }

  async getAllCitizensInfoOnWaitlist(): Promise<WaitlistUser[]> {
    let allCitizens: WaitlistUser[] = [];

    await this.waitlistDao
      .getAllCitizensInfo()
      .then((response) => (allCitizens = response));

    return allCitizens;
  }

  async getCitizenInfoOnWaitlistByUsername(
    username: string
  ): Promise<WaitlistUser | null> {
    let user = null;
    await this.waitlistDao
      .getCitizenInfoByUsername(username)
      .then((response: WaitlistUser | null) => {
        if (!response) {
          throw new NotFoundException(ErrorMessage.ACCOUNT_NOT_EXIST_MESSAGE);
        }
        user = response;
      });
    return user;
  }

  async updateCitizenWaitStatus(
    username: string,
    foodDonorUsername: string
  ): Promise<WaitlistUser | null> {
    let user = null;
    await this.waitlistDao
      .updateCitizenOnWaitlist(username, foodDonorUsername)
      .then((response: WaitlistUser | null) => {
        if (!response) {
          throw new NotFoundException(ErrorMessage.ACCOUNT_NOT_EXIST_MESSAGE);
        }
        user = response;
      });
    await SocketServer.getInstance().broadcastUserUpdateWaitlist(
      username,
      foodDonorUsername
    );
    return user;
  }

  async deleteUserByUsername(username: string): Promise<void> {
    const existingUser =
      await this.getCitizenInfoOnWaitlistByUsername(username);
    if (existingUser) {
      await this.waitlistDao.removeCitizenFromWaitlist(existingUser);
      SocketServer.getInstance().broadcastUserDropWaitlist(username);
    }
  }
}
