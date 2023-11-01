import UserController from "./user.controller";
import express, { NextFunction, Request, Response, Router } from "express";
import { ESNUser } from "./user.entity";
import { lastStatusResponse } from "../types/types";

export default class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = express.Router();
    this.init();
  }

  private init(): void {
    this.registerGetStatusRoute();
    this.registerChangeStatusRoute();
    this.registerUserStatusRoute();
  }

  private registerGetStatusRoute() {
    this.router.get("/status", async (_: Request, response: Response) => {
      response.send(await this.userController.getAllUserStatus());
    });
  }

  private registerUserStatusRoute() {
    this.router.get(
      "/:username/status",
      async (request: Request, response: Response, next: NextFunction) => {
        // try {
        const username: string = request.params.username;
        const lastStatus: string =
          await this.userController.getUserStatusByUsername(username);
        const status: lastStatusResponse = {
          lastStatus: lastStatus,
        };
        response.send(status);
        // } catch (error) {
        //   next(error);
        // }
      }
    );
  }

  private registerChangeStatusRoute() {
    this.router.put(
      "/status",
      async (request: Request, response: Response, next: NextFunction) => {
        // try {
        response.send(
          await this.userController.updateUserStatus(
            request.body.username,
            request.body.lastStatus
          )
        );
        // } catch (error) {
        //   next(error);
        // }
      }
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
