import { Message } from "../message/message.entity";

export interface AuthResponse {
  id: string;
  username: string;
  token: string;
}

export interface LoginAuthentication {
  userExists: boolean;
  passwordMatch: boolean;
}

export interface lastStatusResponse {
  lastStatus: string;
}

export interface Token {
  id: string;
  username: string;
}

export interface CreateUserInput {
  username: string;
  password: string;
}

export interface PostMessageInput {
  content: string;
  sender: string;
  sendee: string;
  senderStatus: string;
}

export interface LikesMessageInput {
  username: string;
  postId: number;
  
}
export interface FoodScheduleInput {
  scheduleid: string;
  scheduler: string;
  schedulee: string;
  time: string;
  status: string;

}
