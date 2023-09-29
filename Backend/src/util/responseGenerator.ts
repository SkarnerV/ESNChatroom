import { LoginCredentials } from "../types/types";

export default class ResponseGenerator {
  static getLoginResponse(
    status: number,
    message: string,
    token?: string
  ): LoginCredentials {
    return {
      status,
      message,
      token,
    };
  }
}
