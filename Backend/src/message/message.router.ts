import express, { Request, Response, Router } from "express";
import MessageController from "./message.controller";
import { PublicMessage } from "./publicMessage.entity";

export default class MessageRouter {
  private router: Router;
  private messageController: MessageController;

  constructor() {
    this.messageController = new MessageController();
    this.router = express.Router();
    this.init();
  }
  private init(): void {
    this.router.get("/public", async (_: Request, response: Response) => {
      const messages = await this.messageController.getAllPublicMessage();
      response.send(messages);
    });
    this.router.post(
      "/public_post",
      async (request: Request, response: Response) => {
        const {
          id: id,
          content: content,
          sender: sender,
          time: time,
        }: PublicMessage = request.body;
        const returnedMessage = await this.messageController.postPublicMessage({
          id: id,
          content: content,
          sender: sender,
          time: time,
        });
        response.send(returnedMessage);
      }
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
