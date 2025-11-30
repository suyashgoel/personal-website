export class UserAlreadyExistsError extends Error {
  constructor() {
    super(`User already exists`);
    this.name = 'UserAlreadyExistsError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super(`User not found`);
    this.name = 'UserNotFoundError';
  }
}

export class OpenAIError extends Error {
  constructor(cause?: unknown) {
    super('OpenAI request failed');
    this.name = 'OpenAIError';
    if (cause) {
      this.cause = cause;
    }
  }
}

export class S3Error extends Error {
  constructor(cause?: unknown) {
    super('S3 request failed');
    this.name = 'S3Error';
    if (cause) {
      this.cause = cause;
    }
  }
}

export class EntryAlreadyExistsError extends Error {
  constructor() {
    super('Entry with this slug already exists');
    this.name = 'EntryAlreadyExistsError';
  }
}

export class ImageMetadataError extends Error {
  constructor() {
    super('Failed to get image metadata');
    this.name = 'ImageMetadataError';
  }
}
