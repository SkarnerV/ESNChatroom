import express, { Request, Response, Router } from "express";
import { CreateUserInput, LoginCredentials } from "../types/types";
import AuthController from "./auth.controller";
import { ESNUser } from "../user/user.entity";

export default class AuthRouter {
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
        const userInput: CreateUserInput = request.body;
        const message: LoginCredentials =
          await this.controller.createUser(userInput);
        response.send(message);
      }
    );
    this.router.post("/login", async (request: Request, response: Response) => {
      const userInput: CreateUserInput = request.body;
      const message: LoginCredentials =
        await this.controller.loginUser(userInput);
      response.send(message);
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
