import UserController from "./user.controller";
import express, { Request, Response, Router } from "express";
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
    this.router.get("/status", async (_: Request, response: Response) => {
      const users: ESNUser[] = await this.userController.getAllUserStatus();
      response.send(users);
    });

    this.router.get(
      "/:username/status",
      async (request: Request, response: Response) => {
        const username: string = request.params.username;
        const lastStatus: string =
          await this.userController.getUserStatusByUsername(username);
        const status: lastStatusResponse = {
          lastStatus: lastStatus,
        };
        response.send(status);
      }
    );

    this.router.put("/status", async (request: Request, response: Response) => {
      const username: string = request.body.username;
      const lastStatus: string = request.body.lastStatus;
      const user = await this.userController.updateUserStatus(
        username,
        lastStatus
      );
      response.send(user);
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
