import {
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from '@personal-website/shared';
import bcrypt from 'bcrypt';
import { db } from '../lib/db';
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../lib/errors';
import { logger } from '../lib/logger';
const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function register(user: RegisterRequest): Promise<UserResponse> {
  const existingUser = await db.user.findUnique({
    where: {
      email: user.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    logger.warn({ userId: existingUser.id }, 'User already exists');
    throw new UserAlreadyExistsError();
  }

  const hashedPassword = await hashPassword(user.password);
  const newUser = await db.user.create({
    data: {
      name: user.name,
      email: user.email,
      hashedPassword: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  return newUser;
}

export async function login(user: LoginRequest): Promise<UserResponse> {
  const existingUser = await db.user.findUnique({
    where: {
      email: user.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      hashedPassword: true,
    },
  });

  if (!existingUser) {
    logger.warn({ email: user.email }, 'Invalid email');
    throw new InvalidCredentialsError();
  }

  const isPasswordValid = await verifyPassword(
    user.password,
    existingUser.hashedPassword
  );

  if (!isPasswordValid) {
    logger.warn({ userId: existingUser.id }, 'Invalid password');
    throw new InvalidCredentialsError();
  }

  const { hashedPassword, ...userResponse } = existingUser;

  return userResponse;
}

export async function getCurrentUser(userId: number): Promise<UserResponse> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  if (!user) {
    logger.warn({ userId: userId }, 'User not found');
    throw new UserNotFoundError();
  }

  return user;
}
