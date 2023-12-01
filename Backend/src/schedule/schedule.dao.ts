import { In, Repository } from "typeorm";
import { FoodSharingSchedule } from "./schedule.entity";
import ESNDatabase from "../database/ESNDatabase";

export default class ScheduleDAO {
  private scheduleDatabase: Repository<FoodSharingSchedule>;

  constructor() {
    this.scheduleDatabase = ESNDatabase.getDatabaseInstance()
      .getDataSource()
      .getRepository(FoodSharingSchedule);
  }

  async createSchedule(
    schedule: FoodSharingSchedule
  ): Promise<FoodSharingSchedule> {
    const createdSchedule = await this.scheduleDatabase.save(schedule);
    return createdSchedule;
  }

  async getAllSchedules(
    scheduler: string,
    schedulee: string
  ): Promise<FoodSharingSchedule[]> {
    const allSchedules = await this.scheduleDatabase.find({
      where: {
        scheduler: In([scheduler, schedulee]),
        schedulee: In([schedulee, scheduler]),
      },
    });
    return allSchedules;
  }

  async deleteSelectedSchedule(scheduleid: string) {
    const deleteResult = await this.scheduleDatabase.delete({
      scheduleid: scheduleid,
    });
    if (deleteResult.affected === 0) {
      throw new Error("Schedule not found");
    } else {
      const deletedSchedule = {
        scheduleid: scheduleid,
        deleteResult: deleteResult,
      };
      return deletedSchedule;
    }
  }

  async updateSelectedSchedule(scheduleid: string, newStatus: string) {
    const updatedResult = await this.scheduleDatabase.findOne({
      where: { scheduleid: scheduleid },
    });
    if (updatedResult) {
      updatedResult.status = newStatus;
      await this.scheduleDatabase.save(updatedResult);
      return updatedResult;
    } else {
      throw new Error("Schedule not found");
    }
  }
}
