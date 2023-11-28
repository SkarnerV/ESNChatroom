import { PostMessageInput } from "../types/types";
import { Message } from "./message.entity";

// Define an abstract product interface
interface MessageFacotry {
  createMessage(message: PostMessageInput): Message;
}

// Create concrete product classes
export class PrivateFacotry implements MessageFacotry {
  createMessage(message: PostMessageInput): Message {
    const newMessage: Message = new Message();
    newMessage.content = message.content;
    newMessage.sender = message.sender;
    newMessage.time = new Date().getTime().toString();
    newMessage.senderStatus = message.senderStatus;
    newMessage.sendee = message.sendee;
    return newMessage;
  }
}

export class PublicFacotry implements MessageFacotry {
  createMessage(message: PostMessageInput): Message {
    const newMessage: Message = new Message();
    newMessage.content = message.content;
    newMessage.sender = message.sender;
    newMessage.time = new Date().getTime().toString();
    newMessage.senderStatus = message.senderStatus;
    newMessage.sendee = message.sendee;
    return newMessage;
  }
}

export class AnnouncementFacotry implements MessageFacotry {
  createMessage(message: PostMessageInput): Message {
    const newMessage: Message = new Message();
    newMessage.content = message.content;
    newMessage.sender = message.sender;
    newMessage.time = new Date().getTime().toString();
    newMessage.senderStatus = message.senderStatus;
    newMessage.sendee = message.sendee;
    return newMessage;
  }
}

export class PostFacotry implements MessageFacotry {
  createMessage(message: PostMessageInput): Message {
    const newMessage: Message = new Message();
    newMessage.content = message.content;
    newMessage.sender = message.sender;
    newMessage.time = new Date().getTime().toString();
    newMessage.senderStatus = message.senderStatus;
    newMessage.sendee = message.sendee;
    newMessage.likes = [];
    return newMessage;
  }
}
