import express, { Request, Response, Router } from "express";
import { LoginCredentials } from "../types/types";
import AuthController from "./auth.controller";
import { ESNUser } from "../user/user.entity";

export default class UserRouter {
  private router: Router;
  private controller: AuthController;

  constructor() {
    this.controller = new AuthController();
    this.router = express.Router();
    this.init();
  }

  private init(): void {
    this.router.post(
      "/register",
      async (request: Request, response: Response) => {
        const user: ESNUser = request.body;
        const message: LoginCredentials =
          await this.controller.createUser(user);
        response.send(message);
      }
    );
    this.router.post("/login", async (request: Request, response: Response) => {
      const user: ESNUser = request.body;
      const message: LoginCredentials = await this.controller.loginUser(user);
      response.send(message);
    });
    this.router.put("/logout", async (request: Request, response: Response) => {
      const token: string = request.body;
      const message: LoginCredentials = await this.controller.logoutUser(token);
      response.send(message);
    });
  }


  getRouter(): Router {
    return this.router;
  }
}
