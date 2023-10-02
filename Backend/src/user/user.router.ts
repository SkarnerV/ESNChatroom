import UserController from "./user.controller";
import express, { Request, Response, Router } from "express";

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
      const users = await this.userController.getAllUserStatus();
      response.send(users);
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
