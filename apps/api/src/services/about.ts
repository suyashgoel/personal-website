import { AboutContent } from '@personal-website/shared';
import { db } from '../clients';
import { CACHE_KEYS, get, set } from '../utils/cache';

const ABOUT_TTL = 60 * 60; // 1 hour

export async function getAboutContent(): Promise<AboutContent> {
  const cached = await get<AboutContent>(CACHE_KEYS.about);
  if (cached) {
    return cached;
  }

  const about = await db.about.findUnique({
    where: { id: 1 },
    select: { content: true },
  });

  const content = about!.content as AboutContent;

  await set(CACHE_KEYS.about, content, ABOUT_TTL);
  return content;
}

export async function updateAboutContent(
  content: AboutContent
): Promise<AboutContent> {
  const result = await db.about.upsert({
    where: { id: 1 },
    update: { content },
    create: { content },
  });

  const updatedContent = result.content as AboutContent;

  await set(CACHE_KEYS.about, updatedContent, ABOUT_TTL);
  return updatedContent;
}
