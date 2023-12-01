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

export interface waitlistUserInput {
  username: string;
  foodComments: string;
}

export interface waitlistUserUpdateInput {
  username: string;
  foodDonor: string;
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

export interface ProfileUpdateInput {
  username?: string;
  password?: string;
  role?: string;
}

export interface UserAccountStatus {
  username: string;
  isActivated: boolean;
}

export interface JwtPayload {
  id: string;
  username: string;
  role: string;
}
