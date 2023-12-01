import UserController from "./user.controller";
import express, { NextFunction, Request, Response, Router } from "express";
import { JwtPayload, lastStatusResponse } from "../types/types";
import jwt from "jsonwebtoken";
import AuthController from "../auth/auth.controller";

export default class UserRouter {
  private router: Router;
  private userController: UserController;
  private authController: AuthController;

  constructor() {
    this.userController = new UserController();
    this.authController = new AuthController();
    this.router = express.Router();
    this.init();
  }

  private init(): void {
    this.registerGetStatusRoute();
    this.registerChangeStatusRoute();
    this.registerUserStatusRoute();
    this.registerChangeUserProfileRoute();
  }

  private registerGetStatusRoute() {
    this.router.get(
      "/status",
      async (_: Request, response: Response, next: NextFunction) => {
        try {
          response.send(await this.userController.getAllUserStatus());
        } catch (err) {
          next(err);
        }
      }
    );
  }

  private registerUserStatusRoute() {
    this.router.get(
      "/:username/status",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const username: string = request.params.username;
          const lastStatus: string =
            await this.userController.getUserStatusByUsername(username);
          const status: lastStatusResponse = {
            lastStatus: lastStatus,
          };
          response.send(status);
        } catch (err) {
          next(err);
        }
      }
    );
  }

  private registerChangeStatusRoute() {
    this.router.put(
      "/status",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          response.send(
            await this.userController.updateUserStatus(
              request.body.username,
              request.body.lastStatus
            )
          );
        } catch (err) {
          next(err);
        }
      }
    );
  }

  private registerChangeUserProfileRoute() {
    this.router.put(
      "/:username/profile",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const token = request.headers["authorization"]?.split(" ")[1]!;
          const currentUsername =
            await this.authController.getUsernameFromToken(token)!;

          response.send(
            await this.userController.updateUserProfile(
              currentUsername,
              request.params.username,
              request.body.newUsername,
              request.body.password,
              request.body.role,
              request.body.isActivated
            )
          );
        } catch (err) {
          next(err);
        }
      }
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
