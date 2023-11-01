import express, { Request, Response, Router } from "express";
import MessageController from "./message.controller";

export default class MessageRouter {
  private router: Router;
  private messageController: MessageController;

  constructor() {
    this.messageController = new MessageController();
    this.router = express.Router();
    this.init();
  }
  private init(): void {
    this.registerGetMessageRoute();
    this.registerGetUnreadMessageRoute();
    this.registerPostMessageRoute();
    this.registerLastMessageRoute();
  }

  private registerGetMessageRoute() {
    this.router.get(
      "/:sender/:sendee",
      async (request: Request, response: Response) => {
        // const token = request.headers["token"] as string;
        const messages = await this.messageController.getAllMessages(
          request.params.sender,
          request.params.sendee
        );
        response.send(messages);
      }
    );
  }

  private registerGetUnreadMessageRoute() {
    this.router.get(
      "/:sendee",
      async (request: Request, response: Response) => {
        // const token = request.headers["token"] as string;
        const messages = await this.messageController.getUnreadMessages(
          request.params.sendee
        );
        response.send(messages);
      }
    );
  }

  private registerPostMessageRoute() {
    this.router.post("/", async (request: Request, response: Response) => {
      const returnedMessage = await this.messageController.postMessage(
        request.body
      );
      response.send(returnedMessage);
    });
  }

  private registerLastMessageRoute() {
    this.router.get(
      "/last/:sender/:sendee",
      async (request: Request, response: Response) => {
        const returnedMessage = await this.messageController.getLastMessage(
          request.params.sender,
          request.params.sendee
        );
        response.send(returnedMessage);
      }
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
