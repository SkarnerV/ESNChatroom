import express, { Request, Response, Router } from "express";
import ScheduleController from "./schedule.controller";

export default class ScheduleRouter {
  private router: Router;
  private scheduleController: ScheduleController;

  constructor() {
    this.scheduleController = new ScheduleController();
    this.router = express.Router();
    this.init();
  }
  private init(): void {
    this.router.post("/", async (request: Request, response: Response) => {
      const returnedSchedule =
        await this.scheduleController.postSharingSchedule(request.body);
      response.send(returnedSchedule);
    });
    this.router.get(
      "/:scheduler/:schedulee",
      async (request: Request, response: Response) => {
        const schedules = await this.scheduleController.getAllSchedules(
          request.params.scheduler,
          request.params.schedulee
        );
        response.send(schedules);
      }
    );
    this.router.delete(
      "/deletion/:scheduleid",
      async (request: Request, response: Response) => {
        try {
          const deletedResult =
            await this.scheduleController.deleteSelectedSchedule(
              request.params.scheduleid
            );

          // Sending a success response
          response.status(200).json({
            message: "Schedule deleted successfully",
            data: deletedResult.scheduleid,
          });
        } catch (error) {
          // Handling any errors
          response.status(404).json({
            message: "Schedule not found",
          });
        }
      }
    );
    this.router.put(
      "/:scheduleid",
      async (request: Request, response: Response) => {
        try {
          const updatedResult =
            await this.scheduleController.updateSelectedSchedule(
              request.params.scheduleid,
              request.body.status
            );

          // Sending a success response
          response.status(200).json({
            message: "Schedule updated successfully",
            data: updatedResult,
          });
        } catch (error) {
          // Handling any errors
          response.status(404).json({
            message: "Schedule not found",
          });
        }
      }
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
