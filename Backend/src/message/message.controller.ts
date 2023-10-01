import { BadRequestException } from "../util/exceptionHandler";
import MessageDAO from "./message.dao";
import { PublicMessage } from "./publicMessage.entity";

export default class MessageController {
  private messageDao: MessageDAO;
  constructor() {
    this.messageDao = new MessageDAO();
  }

  async postPublicMessage(
    publicMessage: PublicMessage
  ): Promise<PublicMessage> {
    if (!publicMessage.sender) {
      throw new BadRequestException("Sender Unknown");
    }

    if (!publicMessage.time) {
      throw new BadRequestException("Time Unkonwn");
    }

    return await this.messageDao.createPublicMessage(publicMessage);
  }

  async getAllPublicMessage(): Promise<PublicMessage[]> {
    let allMessages: PublicMessage[] = [];

    await this.messageDao
      .getAllPublicMessage()
      .then((response) => (allMessages = response));

    return allMessages;
  }
}
