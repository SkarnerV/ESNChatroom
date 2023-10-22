import express, { Request, Response, Router } from "express";
import SpeedTestController from "./speedtest.controller";
import { Message } from "../message/message.entity";

export default class SpeedTestRouter {
  private router: Router;
  private testController: SpeedTestController;

  constructor() {
    this.testController = new SpeedTestController();
    this.router = express.Router();
    this.init();
  }

  private init(): void {
    this.router.put(
      "/speed_test_start",
      async (_: Request, response: Response) => {
        const messages = await this.testController.enterTestMode();
        response.send(messages);
      }
    );

    this.router.get(
      "/speed_test_get/:sender",
      async (request: Request, response: Response) => {
        const messages = await this.testController.getAllPublicMessage(
          request.params.sender,
          "test"
        );
        response.send(messages);
      }
    );

    this.router.post(
      "/speed_test_post",
      async (request: Request, response: Response) => {
        const {
          content: content,
          sender: sender,
          sendee: sendee,
          senderStatus: status,
        } = request.body;
        const returnedMessage = await this.testController.postPublicMessage({
          content: content,
          sender: sender,
          sendee: 'test',
          senderStatus: status,
        });
        response.send(returnedMessage);
      }
    );

    this.router.put(
      "/speed_test_end",
      async (_: Request, response: Response) => {
        const messages = await this.testController.endTestMode();
        response.send(messages);
      }
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
