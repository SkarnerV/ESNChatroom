export const enum StatusCode {
  BAD_REQUEST_CODE = 400,
  NOT_FOUND_CODE = 404,
  SERVER_ERROR_CODE = 500,
  UNAUTHORIZED_CODE = 401,
  RESOURCE_CREATED_CODE = 201,
}

export const enum ErrorMessage {
  ILLEGAL_CREDENTIAL_MESSAGE = "Illegal User Input.",
  WRONG_CREDENTIAL_MESSAGE = "Re-enter the username and/or password.",
  ACCOUNT_NOT_EXIST_MESSAGE = "Account does not exits.",
  SENDER_UNKNOWN_MESSAGE = "Message sender Unknown.",
  SENDER_STATUS_UNKNOWN_MESSAGE = "Sender's Status Unkonwn.",
  UNKNOWN_USER_STATUS = "Unknow Status.",
}

export abstract class Exception extends Error {
  exceptionMessage: ErrorMessage;
  status: StatusCode;
  constructor(message: ErrorMessage, status: StatusCode) {
    super(message);
    this.exceptionMessage = message;
    this.status = status;
  }
}

export class BadRequestException extends Exception {
  constructor(message: ErrorMessage) {
    super(message, StatusCode.BAD_REQUEST_CODE);
  }
}

export class UnauthorizedException extends Exception {
  constructor(message: ErrorMessage) {
    super(message, StatusCode.UNAUTHORIZED_CODE);
  }
}

export class NotFoundException extends Exception {
  constructor(message: ErrorMessage) {
    super(message, StatusCode.NOT_FOUND_CODE);
  }
}
