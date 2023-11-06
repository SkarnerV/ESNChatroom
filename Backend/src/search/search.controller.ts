import { BadRequestException, ErrorMessage } from "../util/exception";
import { ESNUser } from "../user/user.entity";
import UserDAO from "../user/user.dao";
import { UserStatus } from "../user/userStatus";
import { Message } from "../message/message.entity";
import MessageDAO from "../message/message.dao";
import { stopwords } from "./stopwords";

export default class SearchController {
  private userDao: UserDAO = new UserDAO();
  private messageDao: MessageDAO = new MessageDAO();

  constructor() {}

  async searchInformation(
    context: string,
    criteria: string,
    sender?: string,
    sendee?: string
  ): Promise<ESNUser[] | Message[]> {
    let result;
    switch (context) {
      case "citizens":
        result = await this.searchCitizen(criteria as string);
        break;
      case "messages":
        if (!sender && sendee !== "Lobby") {
          throw new BadRequestException(ErrorMessage.SENDER_UNKNOWN_MESSAGE);
        } else if (!sendee) {
          throw new BadRequestException(ErrorMessage.SENDEE_UNKNOWN_MESSAGE);
        }
        result = await this.searchMessage(criteria, sender!, sendee);
        break;
      case "announcements":
        result = await this.searchAnnouncement(criteria);
        break;
      default:
        throw new BadRequestException(
          ErrorMessage.SEARCH_CONTEXT_UNKNOWN_MESSAGE
        );
    }
    return result;
  }

  async searchCitizen(username: string): Promise<ESNUser[]> {
    let users: ESNUser[] = [];
    const validStatuses = [
      UserStatus.GREEN,
      UserStatus.YELLOW,
      UserStatus.RED,
      UserStatus.UNDEFINE,
    ];
    if (validStatuses.includes(username as UserStatus)) {
      users = await this.userDao.getUsersByStatus(username);
    } else {
      users = await this.userDao.getUsersByPartialUsername(
        username.toLowerCase()
      );
    }
    return users;
  }

  async searchMessage(
    words: string,
    sender: string,
    sendee: string
  ): Promise<Message[]> {
    if (stopwords.includes(words.toLowerCase())) {
      return [];
    }
    let messages: Message[] = [];
    if (words === "status") {
      messages = await this.messageDao.getStatusChangeHistory(sendee, sender);
    } else {
      messages = await this.messageDao.getMessageByContent(
        words,
        sender,
        sendee
      );
    }
    return messages;
  }

  async searchAnnouncement(words: string) {
    if (stopwords.includes(words.toLowerCase())) {
      return [];
    }
    return await this.messageDao.getAnnouncementsByContent(words);
  }
}
