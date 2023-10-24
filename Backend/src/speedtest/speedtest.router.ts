import express, { Request, Response, Router } from "express";
import SpeedTestController from "./speedtest.controller";

const errMsg = "System is in test mode. All requests are ignored.";

export default class SpeedTestRouter {
  private router: Router;
  private testController: SpeedTestController;
  private currentUser: string;

  constructor() {
    this.testController = new SpeedTestController();
    this.router = express.Router();
    this.init();
    this.currentUser = "";
  }

  private init(): void {
    this.router.put(
      "/speed_test_start/:sender",
      async (request: Request, response: Response) => {
        if (this.currentUser !== "") {
          response.status(503).send(errMsg);
          return;
        }
        this.currentUser = request.params.sender;
        const messages = await this.testController.enterTestMode();
        response.send({ messages });
      }
    );

    this.router.get(
      "/speed_test_get/:sender",
      async (request: Request, response: Response) => {
        const { sender } = request.params;
        const messages = await this.testController.getAllPublicMessage(
          sender,
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
          senderStatus: status,
        } = request.body;
        const returnedMessage = await this.testController.postPublicMessage({
          content: content,
          sender: sender,
          sendee: "test",
          senderStatus: status,
        });
        response.send(returnedMessage);
      }
    );

    this.router.put(
      "/speed_test_end/:sender",
      async (request: Request, response: Response) => {
        const sender = request.params.sender;
        if (this.currentUser !== sender) {
          response.status(503).send(errMsg);
          return;
        }
        this.currentUser = "";
        const messages = await this.testController.endTestMode();
        response.send({ messages });
      }
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
