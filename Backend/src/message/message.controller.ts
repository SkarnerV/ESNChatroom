import AuthDAO from "../auth/auth.dao";
import { SocketServer } from "../server/socketServer";
import { PostMessageInput } from "../types/types";
import { ESNUser } from "../user/user.entity";
import { BadRequestException } from "../util/exceptionHandler";
import MessageDAO from "./message.dao";
import { Message } from "./message.entity";

export default class MessageController {
  private messageDao: MessageDAO;
  private authDao: AuthDAO;
  constructor() {
    this.messageDao = new MessageDAO();
    this.authDao = new AuthDAO();
  }

  async postMessage(message: PostMessageInput): Promise<Message> {
    if (!message.sender) {
      throw new BadRequestException("Sender Unknown");
    }

    if (!message.senderStatus) {
      throw new BadRequestException("Sender's Status Unkonwn");
    }

    const messageTime = new Date().getTime().toString();

    const createdMessage = await this.messageDao.createMessage(
      message,
      messageTime
    );

    if (message.sendee === "Lobby") {
      SocketServer.getInstance().broadcastPublicMessage(createdMessage);
    } else {
      SocketServer.getInstance().broadcastPrivateMessage(createdMessage);
    }

    return createdMessage;
  }

  async getAllMessages(sender: string, sendee: string): Promise<Message[]> {
    let allMessages: Message[] = [];
    // const decodeToekn = jwt.decode(senderToken) as Token;
    if (sendee === "Lobby") {
      await this.messageDao
        .getAllPublicMessages()
        .then((response) => (allMessages = response));
    } else {
      await this.messageDao
        .getAllMessages(sender, sendee)
        .then((response) => (allMessages = response));
    }

    return allMessages;
  }

  async getUnreadMessages(sendee: string): Promise<Message[]> {
    const esnUser: ESNUser | null = await this.authDao.getUser(sendee);
    let unreadMessages: Message[] = [];
    if (esnUser) {
      unreadMessages = await this.messageDao.getUnreadMessages(
        esnUser.username,
        esnUser.lastOnlineTime
      );
    }
    return unreadMessages;
  }
}
