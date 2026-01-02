import {
  CreateEntry,
  EntryResponse,
  UpdateEntry,
} from '@personal-website/shared';
import sharp from 'sharp';
import { db } from '../clients';
import {
  EntryAlreadyExistsError,
  EntryNotFoundError,
  ImageProcessingError,
} from '../errors';
import { ImageMetadata, UploadParams } from '../types';
import {
  deleteFile,
  generateEmbedding,
  getKeyFromUrl,
  getPublicUrl,
  slugify,
  uploadFile,
} from '../utils';
import { CACHE_KEYS, del, delPattern, get, set } from '../utils/cache';

const CONTENT_MAX_LENGTH = 10000;
const ENTRIES_LIST_TTL = 30 * 60; // 30 minutes
const ENTRY_SINGLE_TTL = 60 * 60; // 1 hour

async function invalidateEntryCaches(slug?: string): Promise<void> {
  if (slug) {
    await del(CACHE_KEYS.entry(slug));
  }
  await delPattern(CACHE_KEYS.recommendationsBySlug('*'));
  await delPattern(CACHE_KEYS.recommendationsByQuery('*'));
  await delPattern(CACHE_KEYS.topMatch('*'));
  await del(CACHE_KEYS.entries);
}

export async function createEntry(entry: CreateEntry): Promise<EntryResponse> {
  const content = `${entry.title}\n${entry.body}`
    .trim()
    .slice(0, CONTENT_MAX_LENGTH);
  const embedding = await generateEmbedding(content);
  const slug = slugify(entry.title);

  const existingEntry = await db.entry.findUnique({
    where: { slug: slug },
  });
  if (existingEntry) {
    throw new EntryAlreadyExistsError();
  }

  let metadata: sharp.Metadata | null = null;
  let imageMetadata: ImageMetadata | null = null;
  const image = entry.image;
  try {
    metadata = await sharp(image as Buffer).metadata();
  } catch (err) {
    throw new ImageProcessingError(err);
  }
  const extension = metadata.format === 'jpg' ? 'jpeg' : metadata.format;

  const uploadParams: UploadParams = {
    key: `${slug}.${extension}`,
    body: image as Buffer,
    contentType: `image/${extension}`,
  };
  await uploadFile(uploadParams);

  imageMetadata = {
    width: metadata.width,
    height: metadata.height,
    key: uploadParams.key,
  };

  try {
    const result = await db.$transaction(async tx => {
      const newEntry = await tx.entry.create({
        data: {
          title: entry.title,
          body: entry.body,
          slug: slug,
          type: entry.type,
        },
      });

      await tx.$executeRaw`
      UPDATE entries 
      SET embedding = ${JSON.stringify(embedding)}::vector 
      WHERE id = ${newEntry.id}
    `;

      await tx.imageContent.create({
        data: {
          url: getPublicUrl(imageMetadata.key),
          width: imageMetadata.width,
          height: imageMetadata.height,
          entryId: newEntry.id,
        },
      });

      return tx.entry.findUnique({
        where: { id: newEntry.id },
        include: { imageContent: true },
      });
    });

    await set(CACHE_KEYS.entry(result!.slug), result, ENTRY_SINGLE_TTL);
    await invalidateEntryCaches();

    return result as EntryResponse;
  } catch (err) {
    if (imageMetadata) {
      try {
        await deleteFile(imageMetadata.key);
      } catch {
        // Ignore error
      }
    }
    throw err;
  }
}

export async function getEntries(): Promise<EntryResponse[]> {
  const cached = await get<EntryResponse[]>(CACHE_KEYS.entries);
  if (cached) {
    return cached;
  }

  const entries = await db.entry.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: { imageContent: true },
  });

  await set(CACHE_KEYS.entries, entries, ENTRIES_LIST_TTL);
  return entries as EntryResponse[];
}

export async function getEntry(slug: string): Promise<EntryResponse> {
  const cached = await get<EntryResponse>(CACHE_KEYS.entry(slug));
  if (cached) {
    return cached;
  }

  const entry = await db.entry.findUnique({
    where: { slug: slug },
    include: { imageContent: true },
  });
  if (!entry) {
    throw new EntryNotFoundError();
  }

  await set(CACHE_KEYS.entry(slug), entry, ENTRY_SINGLE_TTL);
  return entry as EntryResponse;
}

export async function deleteEntry(slug: string): Promise<void> {
  const entry = await db.entry.findUnique({
    where: { slug },
    include: { imageContent: true },
  });
  if (!entry) {
    throw new EntryNotFoundError();
  }

  if (entry.imageContent) {
    const key = getKeyFromUrl(entry.imageContent.url);
    await deleteFile(key);
  }

  await db.entry.delete({
    where: { slug },
  });

  await invalidateEntryCaches(slug);
}

export async function updateEntry(
  slug: string,
  updatedData: UpdateEntry
): Promise<EntryResponse> {
  let existingEntry: EntryResponse;
  const cached = await get<EntryResponse>(CACHE_KEYS.entry(slug));
  if (cached) {
    existingEntry = cached;
  } else {
    const entry = await db.entry.findUnique({
      where: { slug },
      include: { imageContent: true },
    });
    if (!entry) {
      throw new EntryNotFoundError();
    }
    existingEntry = entry as EntryResponse;
  }

  const newTitle = updatedData.title ?? existingEntry.title;
  const newBody = updatedData.body ?? existingEntry.body;

  if (newTitle === existingEntry.title && newBody === existingEntry.body) {
    return existingEntry;
  }

  let newEmbedding: number[] | null = null;
  if (updatedData.title || updatedData.body) {
    const content = `${newTitle}\n${newBody}`
      .trim()
      .slice(0, CONTENT_MAX_LENGTH);
    newEmbedding = await generateEmbedding(content);
  }
  const result = await db.$transaction(async tx => {
    await tx.entry.update({
      where: { slug },
      data: {
        title: newTitle,
        body: newBody,
      },
    });

    if (newEmbedding) {
      await tx.$executeRaw`
          UPDATE entries 
          SET embedding = ${JSON.stringify(newEmbedding)}::vector 
          WHERE id = ${existingEntry.id}
        `;
    }

    return tx.entry.findUnique({
      where: { id: existingEntry.id },
      include: { imageContent: true },
    })!;
  });

  await set(CACHE_KEYS.entry(slug), result, ENTRY_SINGLE_TTL);
  await invalidateEntryCaches();

  return result as EntryResponse;
}
