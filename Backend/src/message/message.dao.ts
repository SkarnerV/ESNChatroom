import { In, MoreThan, Repository } from "typeorm";
import { Message } from "./message.entity";
import ESNDatabase from "../database/ESNDatabase";

export default class MessageDAO {
  private messageDatabase: Repository<Message>;

  constructor() {
    this.messageDatabase = ESNDatabase.getDatabaseInstance()
      .getDataSource()
      .getRepository(Message);
  }

  async createMessage(message: Message): Promise<Message> {
    const createdMessage = await this.messageDatabase.save(message);
    return createdMessage;
  }

  async getAllMessages(sender: string, sendee: string): Promise<Message[]> {
    const allMessages = await this.messageDatabase.find({
      where: {
        sender: In([sendee, sender]),
        sendee: In([sender, sendee]),
      },
    });
    return allMessages;
  }

  async getLastPublicMessage(sendee: string): Promise<Message | null> {
    const lastMessage = await this.messageDatabase.findOne({
      order: {
        id: "DESC",
      },
      where: {
        sendee: sendee,
      },
    });
    return lastMessage;
  }

  async getAllPublicMessages(sendee: string): Promise<Message[]> {
    const allMessages = await this.messageDatabase.findBy({
      sendee: sendee,
    });
    return allMessages;
  }

  async getUnreadMessages(
    sendee: string,
    lastOnlineTime: string
  ): Promise<Message[]> {
    const allMessages = await this.messageDatabase.find({
      where: {
        sendee: sendee,
        time: MoreThan(lastOnlineTime),
      },
    });
    return allMessages;
  }
}
