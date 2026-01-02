export abstract class UserError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export abstract class ServiceError extends Error {
  abstract statusCode: number;

  constructor(
    message: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UserAlreadyExistsError extends UserError {
  statusCode = 409;
  constructor() {
    super('User already exists');
  }
}

export class InvalidCredentialsError extends UserError {
  statusCode = 401;
  constructor() {
    super('Invalid email or password');
  }
}

export class UserNotFoundError extends UserError {
  statusCode = 404;
  constructor() {
    super('User not found');
  }
}

export class EntryNotFoundError extends UserError {
  statusCode = 404;
  constructor() {
    super('Entry not found');
  }
}

export class EntryAlreadyExistsError extends UserError {
  statusCode = 409;
  constructor() {
    super('Entry with this slug already exists');
  }
}

export class InvalidUpdateError extends UserError {
  statusCode = 400;
  constructor(message: string) {
    super(message);
  }
}

export class OpenAIError extends ServiceError {
  statusCode = 500;
  constructor(cause?: unknown) {
    super('OpenAI request failed');
    if (cause) {
      this.cause = cause;
    }
  }
}

export class S3Error extends ServiceError {
  statusCode = 500;
  constructor(cause?: unknown) {
    super('S3 request failed');
    if (cause) {
      this.cause = cause;
    }
  }
}

export class ImageProcessingError extends ServiceError {
  statusCode = 500;
  constructor(cause?: unknown) {
    super('Failed to process image');
    if (cause) {
      this.cause = cause;
    }
  }
}
