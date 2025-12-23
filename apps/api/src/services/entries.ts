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
  ImageMetadataError,
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

const CONTENT_MAX_LENGTH = 10000;

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

  let imageMetadata: ImageMetadata | null = null;
  const image = entry.image;

  const metadata = await sharp(image as Buffer).metadata();
  if (!metadata.format || !metadata.width || !metadata.height) {
    throw new ImageMetadataError();
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
  const entries = await db.entry.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: { imageContent: true },
  });
  return entries as EntryResponse[];
}

export async function getEntry(slug: string): Promise<EntryResponse> {
  const entry = await db.entry.findUnique({
    where: { slug: slug },
    include: { imageContent: true },
  });
  if (!entry) {
    throw new EntryNotFoundError();
  }
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
}

export async function updateEntry(
  slug: string,
  updatedData: UpdateEntry
): Promise<EntryResponse> {
  const existingEntry = await getEntry(slug);

  const newTitle = updatedData.title ?? existingEntry.title;
  const newBody = updatedData.body ?? existingEntry.body;

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

  return result as EntryResponse;
}
