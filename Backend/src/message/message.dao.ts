import { In, Like, MoreThan, Repository } from "typeorm";
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

  async deleteMessage(id: number): Promise<Message | null> {
    const deleteMessage = await this.messageDatabase.findOneBy({ id: id });

    if (deleteMessage) {
      return await this.messageDatabase.remove(deleteMessage);
    }
    return null;
  }

  async getMessageById(id: number): Promise<Message | null> {
    return await this.messageDatabase.findOneBy({ id: id });
  }

  async getMessageByContent(
    content: string,
    sender: string,
    sendee: string
  ): Promise<Message[]> {
    const messages = await this.messageDatabase.find({
      where: [
        { content: Like(`%${content}%`), sender, sendee },
        { content: Like(`%${content}%`), sender: sendee, sendee: sender },
      ],
      order: { id: "DESC" },
    });
    return messages;
  }

  async getAnnouncementsByContent(content: string): Promise<Message[]> {
    const messages = await this.messageDatabase.find({
      where: { content: Like(`%${content}%`), sendee: "Announcement" },
      order: { id: "DESC" },
    });
    return messages;
  }

  async getStatusChangeHistory(
    sender: string,
    sendee: string
  ): Promise<Message[]> {
    const messages = await this.messageDatabase.find({
      where: { sender, sendee },
      order: { id: "DESC" },
    });
    return messages.filter((message: Message, idx: number) => {
      if (idx === 0) return true;
      return message.senderStatus !== messages[idx - 1].senderStatus;
    });
  }
}
