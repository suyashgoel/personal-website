export class UserAlreadyExistsError extends Error {
  statusCode = 409;
  constructor() {
    super('User already exists');
    this.name = 'UserAlreadyExistsError';
  }
}

export class InvalidCredentialsError extends Error {
  statusCode = 401;
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

export class UserNotFoundError extends Error {
  statusCode = 404;
  constructor() {
    super('User not found');
    this.name = 'UserNotFoundError';
  }
}

export class EntryNotFoundError extends Error {
  statusCode = 404;
  constructor() {
    super('Entry not found');
    this.name = 'EntryNotFoundError';
  }
}

export class OpenAIError extends Error {
  statusCode = 500;
  constructor(cause?: unknown) {
    super('OpenAI request failed');
    this.name = 'OpenAIError';
    if (cause) {
      this.cause = cause;
    }
  }
}

export class S3Error extends Error {
  statusCode = 500;
  constructor(cause?: unknown) {
    super('S3 request failed');
    this.name = 'S3Error';
    if (cause) {
      this.cause = cause;
    }
  }
}

export class EntryAlreadyExistsError extends Error {
  statusCode = 409;
  constructor() {
    super('Entry with this slug already exists');
    this.name = 'EntryAlreadyExistsError';
  }
}

export class ImageMetadataError extends Error {
  statusCode = 500;
  constructor() {
    super('Failed to get image metadata');
    this.name = 'ImageMetadataError';
  }
}

export class InvalidUpdateError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUpdateError';
  }
}
