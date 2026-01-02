import { OpenAI } from 'openai';
import { env } from '../config';

export const openai = new OpenAI({
  apiKey: env.OPENAI_KEY,
  timeout: 10000, // 10 seconds
  maxRetries: 2,
});
