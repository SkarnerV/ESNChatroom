import AuthDAO from "../auth/auth.dao";
import LikesDAO from "../likes/likes.dao";
import { Likes } from "../likes/likes.entity";
import { SocketServer } from "../server/socketServer";
import { LikesMessageInput, PostMessageInput } from "../types/types";
import { ESNUser } from "../user/user.entity";
import {
  BadRequestException,
  ErrorMessage,
  NotFoundException,
} from "../util/exception";
import MessageDAO from "./message.dao";
import { Message } from "./message.entity";
import {
  AnnouncementFacotry,
  PostFacotry,
  PrivateFacotry,
  PublicFacotry,
} from "./messageFactory";

export default class MessageController {
  private messageDao: MessageDAO;
  private likesDao: LikesDAO;
  private authDao: AuthDAO;
  private publicFactory: PublicFacotry;
  private privateFactory: PrivateFacotry;
  private announcementFactory: AnnouncementFacotry;
  private postFactory: PostFacotry;
  constructor() {
    this.messageDao = new MessageDAO();
    this.authDao = new AuthDAO();
    this.likesDao = new LikesDAO();
    this.publicFactory = new PublicFacotry();
    this.privateFactory = new PrivateFacotry();
    this.announcementFactory = new AnnouncementFacotry();
    this.postFactory = new PostFacotry();
  }

  async postMessage(message: PostMessageInput): Promise<Message> {
    if (!message.sender) {
      throw new BadRequestException(ErrorMessage.SENDER_UNKNOWN_MESSAGE);
    }

    if (!message.senderStatus) {
      throw new BadRequestException(ErrorMessage.SENDER_STATUS_UNKNOWN_MESSAGE);
    }
    let newMessage: Message;

    switch (message.sendee) {
      case "Lobby": {
        newMessage = this.publicFactory.createMessage(message);
        break;
      }
      case "Announcement": {
        newMessage = this.announcementFactory.createMessage(message);
        break;
      }
      case "Post": {
        newMessage = this.postFactory.createMessage(message);
        break;
      }
      default: {
        newMessage = this.privateFactory.createMessage(message);
        break;
      }
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
    if (sendee === "Lobby" || sendee === "Announcement" || sendee == "Post") {
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
    if (sendee === "Lobby" || sendee === "Announcement" || sendee === "Post") {
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

  async likesPost(likesMessage: LikesMessageInput): Promise<Message> {
    const likedMessage: Message | null = await this.messageDao.getMessageById(
      likesMessage.postId
    );

    if (!likedMessage) {
      throw new NotFoundException(ErrorMessage.MESSAGE_NOT_FOUND);
    }

    let likedBefore: Likes[] = [];
    if (likedMessage.likes) {
      const allLikes: Likes[] = likedMessage.likes;

      likedBefore = allLikes.filter(
        (like) => like.username === likesMessage.username
      );
    }

    if (likedBefore.length > 0) {
      await this.likesDao.deleteOneById(likedBefore[0].id);
    } else {
      await this.likesDao.createLike(likesMessage, likedMessage);
    }

    const newMessage = await this.messageDao.getMessageById(
      likesMessage.postId
    );

    if (newMessage) {
      return newMessage;
    }

    throw new NotFoundException(ErrorMessage.MESSAGE_NOT_FOUND);
  }

  async deletePost(postId: number): Promise<Message> {
    const deletedMessage = await this.messageDao.deleteMessage(postId);

    if (deletedMessage) {
      SocketServer.getInstance().broadcastDeleteMessage(postId, deletedMessage);

      return deletedMessage;
    }

    throw new NotFoundException(ErrorMessage.MESSAGE_NOT_FOUND);
  }
}
