import { UserResponse } from '@personal-website/shared';
import { atom } from 'jotai';

export const userAtom = atom<UserResponse | null>(null);
export const searchQueryAtom = atom<string>('');
