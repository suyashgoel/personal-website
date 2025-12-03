import { AboutContent } from '@personal-website/shared';
import { db } from '../clients';

export async function getAboutContent(): Promise<AboutContent> {
  const about = await db.about.findUnique({
    where: { id: 1 },
    select: { content: true },
  });

  return about!.content as AboutContent;
}

export async function updateAboutContent(
  content: AboutContent
): Promise<AboutContent> {
  const result = await db.about.upsert({
    where: { id: 1 },
    update: { content },
    create: { content },
  });

  return result.content as AboutContent;
}
