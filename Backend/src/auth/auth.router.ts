import express, { NextFunction, Request, Response, Router } from "express";
import { AuthResponse, CreateUserInput } from "../types/types";
import AuthController from "./auth.controller";
import { StatusCode } from "../util/exception";

export default class AuthRouter {
  private router: Router;
  private controller: AuthController;

  constructor() {
    this.controller = new AuthController();
    this.router = express.Router();
    this.init();
  }

  private init(): void {
    this.useLoginRoute();
    this.useRegisterRoute();
  }

  private useRegisterRoute(): void {
    this.router.post(
      "/register",
      async (request: Request, response: Response, next: NextFunction) => {
        const userInput: CreateUserInput = request.body;
        try {
          const authResponse: AuthResponse =
            await this.controller.createUser(userInput);
          response.status(StatusCode.RESOURCE_CREATED_CODE).send(authResponse);
        } catch (err) {
          next(err);
        }
      }
    );
  }

  private useLoginRoute(): void {
    this.router.post(
      "/login",
      async (request: Request, response: Response, next: NextFunction) => {
        const userInput: CreateUserInput = request.body;
        try {
          const authResponse: AuthResponse =
            await this.controller.loginUser(userInput);
          response.status(StatusCode.RESOURCE_CREATED_CODE).send(authResponse);
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
