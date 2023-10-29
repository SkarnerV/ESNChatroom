import { AuthResponse } from "../types/types";

export default class Response {
  static authResponse(
    id: string,
    username: string,
    token: string
  ): AuthResponse {
    return {
      id,
      username,
      token,
    };
  }
}
