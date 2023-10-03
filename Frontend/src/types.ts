export interface ESNMessage {
  content: string;
  sender: string;
  time: string;
}

export interface ESNUserStatus {
  username: string;
  lastStatus: string;
  isOnline: boolean;
}
