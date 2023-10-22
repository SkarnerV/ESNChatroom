export interface LoginCredentials {
  status: number;
  message: string;
  token?: string;
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
