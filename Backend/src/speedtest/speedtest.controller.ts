import SpeedTestDAO from "./speedtest.dao";
import { Message } from "../message/message.entity";
import { PostMessageInput } from "../types/types";
import MessageController from "../message/message.controller";

export default class SpeedTestController {
  private testDao: SpeedTestDAO;
  private messageController: MessageController | null;
  private static isTestMode: boolean = true;

  constructor() {
    this.testDao = new SpeedTestDAO();
    this.messageController = null;
  }

  async enterTestMode(): Promise<string> {
    let message: string = "";
    await this.testDao.enterTestMode().then((response) => (message = response));
    this.messageController = new MessageController();
    this.setTestMode(true);
    return message;
  }

  async postPublicMessage(publicMessage: PostMessageInput): Promise<Message> {
    return this.messageController!.postMessage(publicMessage);
  }

  async getAllPublicMessage(
    sender: string,
    sendee: string
  ): Promise<Message[]> {
    return this.messageController!.getAllMessages(sender, sendee);
  }

  async endTestMode(): Promise<string> {
    let message: string = "";
    await this.testDao.endTestMode().then((response) => (message = response));
    this.setTestMode(false);
    return message;
  }

  setTestMode(status: boolean): void {
    SpeedTestController.isTestMode = status;
  }

  static getTestMode(): boolean {
    return SpeedTestController.isTestMode;
  }
}