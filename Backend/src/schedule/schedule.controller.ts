import ScheduleDAO from "./schedule.dao";
import { FoodSharingSchedule } from "./schedule.entity";
import { BadRequestException } from "../util/exception";
import { FoodScheduleInput } from "../types/types";
import { response } from "express";
import { DeleteResult } from "typeorm";

export default class ScheduleController {
  private scheduleDao: ScheduleDAO;
  constructor() {
    this.scheduleDao = new ScheduleDAO();
  }
  async postSharingSchedule(
    schedule: FoodScheduleInput
  ): Promise<FoodSharingSchedule> {
    let newSchedule: FoodSharingSchedule = new FoodSharingSchedule();
    newSchedule.scheduleid = schedule.scheduleid;
    newSchedule.scheduler = schedule.scheduler;
    newSchedule.schedulee = schedule.schedulee;
    newSchedule.time = schedule.time;
    newSchedule.status = schedule.status;

    const createdSchedule = await this.scheduleDao.createSchedule(newSchedule);
    return createdSchedule;
  }

  async getAllSchedules(
    scheduler: string,
    schedulee: string
  ): Promise<FoodSharingSchedule[]> {
    let allSchedules: FoodSharingSchedule[] = [];
    await this.scheduleDao
      .getAllSchedules(scheduler, schedulee)
      .then((response) => (allSchedules = response));

    return allSchedules;
  }

  async deleteSelectedSchedule(scheduleid: string) {
    const deletedResult: { scheduleid: string; deleteResult: DeleteResult } =
      await this.scheduleDao.deleteSelectedSchedule(scheduleid);
    return deletedResult;
  }

  async updateSelectedSchedule(scheduleid: string, newStatus: string) {
    const updatedResult: FoodScheduleInput | null =
      await this.scheduleDao.updateSelectedSchedule(scheduleid, newStatus);
    return updatedResult;
  }
}
