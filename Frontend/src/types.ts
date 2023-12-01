export interface ESNMessage {
  id?: number;
  content: string;
  sender: string;
  sendee: string;
  time?: string;
  likes?: Likes[];
  senderStatus: string;
}

export interface Likes {
  id: number;
  username: string;
}

export interface ESNUserStatus {
  username: string;
  lastStatus: string;
}

export interface ESNWaitlistUser {
  username: string;
  foodComments: string;
  waitlistStatus: string;
  foodDonor: string;
}
export interface FoodSharingSchedule {
  scheduleid: string;
  scheduler: string;
  schedulee: string;
  time: string;
  status: string;
}
export interface ESNUserProfile {
  username: string;
  account_status: string;
  privilege_level: string;
}
export interface ESNUserUpdateProfile {
  username: string;
  password: string;
  account_status: string;
  privilege_level: string;
}
