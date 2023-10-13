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
