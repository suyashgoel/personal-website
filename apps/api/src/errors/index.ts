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
  constructor() {
    super('OpenAI request failed');
    this.name = 'OpenAIError';
  }
}
