import { Repository } from "typeorm";
import { PublicMessage } from "./publicMessage.entity";
import ESNDatabase from "../database/ESNDatabase";

export default class MessageDAO {
  private publicMessageDatabase: Repository<PublicMessage>;
  constructor() {
    this.publicMessageDatabase = ESNDatabase.getDatabaseInstance()
      .getDataSource()
      .getRepository(PublicMessage);
  }

  async createPublicMessage(
    publicMessage: PublicMessage
  ): Promise<PublicMessage> {
    const message = this.publicMessageDatabase.create();
    message.content = publicMessage.content;
    message.sender = publicMessage.sender;
    message.time = publicMessage.time;
    message.senderStatus = publicMessage.senderStatus;
    const createdMessage = await this.publicMessageDatabase.save(message);
    return createdMessage;
  }

  async getAllPublicMessage(): Promise<PublicMessage[]> {
    const allMessages = await this.publicMessageDatabase.find();
    return allMessages;
  }
}
