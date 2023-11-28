import express, { NextFunction, Request, Response, Router } from "express";
import MessageController from "./message.controller";
import { StatusCode } from "../util/exception";

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
    this.registerLikesPostRoute();
    this.registerDeletePostRoute();
  }

  private registerGetMessageRoute() {
    this.router.get(
      "/:sender/:sendee",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const messages = await this.messageController.getAllMessages(
            request.params.sender,
            request.params.sendee
          );
          response.send(messages);
        } catch (err) {
          next(err);
        }
      }
    );
  }

  private registerGetUnreadMessageRoute() {
    this.router.get(
      "/:sendee",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const messages = await this.messageController.getUnreadMessages(
            request.params.sendee
          );
          response.send(messages);
        } catch (err) {
          next(err);
        }
      }
    );
  }

  private registerPostMessageRoute() {
    this.router.post(
      "/",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const returnedMessage = await this.messageController.postMessage(
            request.body
          );
          response
            .status(StatusCode.RESOURCE_CREATED_CODE)
            .send(returnedMessage);
        } catch (err) {
          next(err);
        }
      }
    );
  }

  private registerLastMessageRoute() {
    this.router.get(
      "/last/:sender/:sendee",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const returnedMessage = await this.messageController.getLastMessage(
            request.params.sender,
            request.params.sendee
          );
          response.send(returnedMessage);
        } catch (err) {
          next(err);
        }
      }
    );
  }

  private registerLikesPostRoute() {
    this.router.put(
      "/likes",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const returnedMessage = await this.messageController.likesPost(
            request.body
          );
          response.send(returnedMessage);
        } catch (err) {
          next(err);
        }
      }
    );
  }

  private registerDeletePostRoute() {
    this.router.delete(
      "/:id",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const returnedMessage = await this.messageController.deletePost(
            parseInt(request.params.id)
          );
          response.send(returnedMessage);
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
