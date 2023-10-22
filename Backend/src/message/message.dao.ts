import { In, MoreThan, Repository } from "typeorm";
import { Message } from "./message.entity";
import ESNDatabase from "../database/ESNDatabase";
import { PostMessageInput } from "../types/types";

export default class MessageDAO {
  private messageDatabase: Repository<Message>;
  constructor() {
    this.messageDatabase = ESNDatabase.getDatabaseInstance()
      .getDataSource()
      .getRepository(Message);
  }

  async createMessage(
    message: PostMessageInput,
    messageTime: string
  ): Promise<Message> {
    const newMessage = this.messageDatabase.create();
    newMessage.content = message.content;
    newMessage.sender = message.sender;
    newMessage.time = messageTime;
    newMessage.senderStatus = message.senderStatus;
    newMessage.sendee = message.sendee;
    const createdMessage = await this.messageDatabase.save(newMessage);
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

  async getAllPublicMessages(): Promise<Message[]> {
    const allMessages = await this.messageDatabase.findBy({
      sendee: "Lobby",
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
