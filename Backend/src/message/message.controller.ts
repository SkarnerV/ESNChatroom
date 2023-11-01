import AuthDAO from "../auth/auth.dao";
import { SocketServer } from "../server/socketServer";
import { PostMessageInput } from "../types/types";
import { ESNUser } from "../user/user.entity";
import { BadRequestException, ErrorMessage } from "../util/exception";
import MessageDAO from "./message.dao";
import { Message } from "./message.entity";
import {
  AnnouncementFacotry,
  PrivateFacotry,
  PublicFacotry,
} from "./messageFactory";

export default class MessageController {
  private messageDao: MessageDAO;
  private authDao: AuthDAO;
  private publicFactory: PublicFacotry;
  private privateFactory: PrivateFacotry;
  private announcementFactory: AnnouncementFacotry;
  constructor() {
    this.messageDao = new MessageDAO();
    this.authDao = new AuthDAO();
    this.publicFactory = new PublicFacotry();
    this.privateFactory = new PrivateFacotry();
    this.announcementFactory = new AnnouncementFacotry();
  }

  async postMessage(message: PostMessageInput): Promise<Message> {
    if (!message.sender) {
      throw new BadRequestException(ErrorMessage.SENDER_UNKNOWN_MESSAGE);
    }

    if (!message.senderStatus) {
      throw new BadRequestException(ErrorMessage.SENDER_STATUS_UNKNOWN_MESSAGE);
    }
    let newMessage: Message;
    if (message.sendee === "Lobby") {
      newMessage = this.publicFactory.createMessage(message);
    } else if (message.sendee === "Announcement") {
      newMessage = this.announcementFactory.createMessage(message);
    } else {
      newMessage = this.privateFactory.createMessage(message);
    }

    const createdMessage = await this.messageDao.createMessage(newMessage);

    SocketServer.getInstance().broadcastMessage(
      createdMessage.sendee,
      createdMessage
    );

    return createdMessage;
  }

  async getAllMessages(sender: string, sendee: string): Promise<Message[]> {
    let allMessages: Message[] = [];
    // const decodeToekn = jwt.decode(senderToken) as Token;
    if (sendee === "Lobby" || sendee === "Announcement") {
      await this.messageDao
        .getAllPublicMessages(sendee)
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

  async getLastMessage(_: string, sendee: string): Promise<Message[]> {
    let lastMessage: Message[] = [];
    // const decodeToekn = jwt.decode(senderToken) as Token;
    if (sendee === "Lobby" || sendee === "Announcement") {
      await this.messageDao
        .getLastPublicMessage(sendee)
        .then((response) =>
          response ? (lastMessage = [response]) : (lastMessage = [])
        );
    } else {
      lastMessage = []; // not implemented yet
    }

    return lastMessage;
  }
}
