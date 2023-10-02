export const enum statusCode {
  BAD_REQUEST_CODE = 400,
  NOT_FOUND = 404,
  SERVER_ERROR_CODE = 500,
}

export abstract class Exception extends Error {
  message: string;
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

export class BadRequestException extends Exception {
  constructor(message: string) {
    super(message, statusCode.BAD_REQUEST_CODE);
  }
}

export class notFoundException extends Exception {
  constructor(message: string) {
    super(message, statusCode.NOT_FOUND);
  }
}
