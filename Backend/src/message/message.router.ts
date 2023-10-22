import express, { Request, Response, Router } from "express";
import MessageController from "./message.controller";
import { Message } from "./message.entity";

export default class MessageRouter {
  private router: Router;
  private messageController: MessageController;

  constructor() {
    this.messageController = new MessageController();
    this.router = express.Router();
    this.init();
  }
  private init(): void {
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
    this.router.post("/", async (request: Request, response: Response) => {
      const {
        content: content,
        sender: sender,
        sendee: sendee,
        senderStatus: status,
      } = request.body;
      const returnedMessage = await this.messageController.postMessage({
        content: content,
        sender: sender,
        sendee: sendee,
        senderStatus: status,
      });
      response.send(returnedMessage);
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
