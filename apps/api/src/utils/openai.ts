import { openai } from '../clients';
import { OpenAIError } from '../errors';

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: text,
    });
    return response.data[0].embedding;
  } catch (err) {
    throw new OpenAIError(err);
  }
}
