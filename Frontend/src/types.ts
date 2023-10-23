export interface ESNMessage {
  content: string;
  sender: string;
  sendee: string;
  time?: string;
  senderStatus: string;
}

export interface ESNUserStatus {
  username: string;
  lastStatus: string;
}
