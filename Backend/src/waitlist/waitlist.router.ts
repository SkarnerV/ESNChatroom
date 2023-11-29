import WaitlistController from "./waitlist.controller";
import express, { NextFunction, Request, Response, Router } from "express";
import { waitlistUserInput } from "../types/types";

export default class WaitlistRouter {
  private router: Router;
  private waitlistController: WaitlistController;

  constructor() {
    this.waitlistController = new WaitlistController();
    this.router = express.Router();
    this.init();
  }

  private init(): void {
    this.registerGetAllCitizensRoute();
    this.registerChangeWaitlistStatusRoute();
    this.registerGetCitizenInfoRoute();
    this.registerDeleteCitizenRoute();
    this.registerJoinWaitlistRoute();
  }

  private registerGetAllCitizensRoute() {
    this.router.get("/allCitizens", async (_: Request, response: Response) => {
      response.send(
        await this.waitlistController.getAllCitizensInfoOnWaitlist()
      );
    });
  }

  private registerGetCitizenInfoRoute() {
    this.router.get(
      "/:citizen",
      async (request: Request, response: Response) => {
        const citizenUsername: string = request.params.citizen;
        response.send(
          await this.waitlistController.getCitizenInfoOnWaitlistByUsername(
            citizenUsername
          )
        );
      }
    );
  }

  private registerJoinWaitlistRoute() {
    this.router.post("/", async (request: Request, response: Response) => {
      let userInput: waitlistUserInput = {
        username: request.body.username,
        foodComments: request.body.foodComments,
      };
      const userJoinInfo =
        await this.waitlistController.putCitizenOnWaitlist(userInput);
      response.send(userJoinInfo);
    });
  }

  private registerChangeWaitlistStatusRoute() {
    this.router.put(
      "/:citizen",
      async (request: Request, response: Response) => {
        response.send(
          await this.waitlistController.updateCitizenWaitStatus(
            request.body.username,
            request.body.foodDonor
          )
        );
      }
    );
  }

  private registerDeleteCitizenRoute() {
    this.router.delete(
      "/:citizen",
      async (request: Request, response: Response) => {
        const username: string = request.params.citizen;
        response.send(
          await this.waitlistController.deleteUserByUsername(username)
        );
      }
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
