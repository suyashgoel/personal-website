import {
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from '@personal-website/shared';
import { db } from '../clients';
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../errors';
import { hashPassword, verifyPassword } from '../utils';

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
    throw new InvalidCredentialsError();
  }

  const isPasswordValid = await verifyPassword(
    user.password,
    existingUser.hashedPassword
  );

  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }

  const { hashedPassword: _, ...userResponse } = existingUser;

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
    throw new UserNotFoundError();
  }

  return user;
}
