import { openai } from '../clients/openai';
import { OpenAIError } from '../errors';

export const generateEmbedding = async (text: string) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: text,
    });
    return response.data[0].embedding;
  } catch (err) {
    throw new OpenAIError();
  }
};
