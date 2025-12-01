import {
  CreateEntry,
  EntryResponse,
  UpdateEntry,
} from '@personal-website/shared';
import sharp from 'sharp';
import { db } from '../clients/db';
import {
  EntryAlreadyExistsError,
  EntryNotFoundError,
  ImageMetadataError,
  InvalidUpdateError,
} from '../errors';
import { ImageMetadata } from '../types/image';
import { UploadParams } from '../types/upload';
import { generateEmbedding } from '../utils/openai';
import {
  deleteFile,
  getKeyFromUrl,
  getPublicUrl,
  uploadFile,
} from '../utils/s3';
import { slugify } from '../utils/slug';

const CONTENT_MAX_LENGTH = 10000;

const ENTRY_TYPE_IMAGE = 'image';
const ENTRY_TYPE_LINK = 'link';

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
  if (entry.type === ENTRY_TYPE_IMAGE) {
    const image = entry.image;

    const metadata = await sharp(image).metadata();
    if (!metadata.format || !metadata.width || !metadata.height) {
      throw new ImageMetadataError();
    }
    const extension = metadata.format === 'jpg' ? 'jpeg' : metadata.format;

    const uploadParams: UploadParams = {
      key: `${slug}.${extension}`,
      body: image,
      contentType: `image/${extension}`,
    };
    await uploadFile(uploadParams);

    imageMetadata = {
      width: metadata.width,
      height: metadata.height,
      key: uploadParams.key,
    };
  }

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

      if (entry.type === ENTRY_TYPE_IMAGE && imageMetadata) {
        // Image entry
        await tx.imageContent.create({
          data: {
            url: getPublicUrl(imageMetadata.key),
            width: imageMetadata.width,
            height: imageMetadata.height,
            entryId: newEntry.id,
          },
        });
      }

      if (entry.type === ENTRY_TYPE_LINK) {
        // Link entry
        await tx.linkContent.create({
          data: {
            url: entry.url,
            entryId: newEntry.id,
          },
        });
      }

      return tx.entry.findUnique({
        where: { id: newEntry.id },
        include: { imageContent: true, linkContent: true },
      });
    });
    return result!;
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
    include: { imageContent: true, linkContent: true },
  });
  return entries;
}

export async function getEntry(slug: string): Promise<EntryResponse> {
  const entry = await db.entry.findUnique({
    where: { slug: slug },
    include: { imageContent: true, linkContent: true },
  });
  if (!entry) {
    throw new EntryNotFoundError();
  }
  return entry;
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

  if (updatedData.image && existingEntry.type !== ENTRY_TYPE_IMAGE) {
    throw new InvalidUpdateError(
      'Cannot update image field on non-image entry'
    );
  }
  if (updatedData.url && existingEntry.type !== ENTRY_TYPE_LINK) {
    throw new InvalidUpdateError('Cannot update url field on non-link entry');
  }

  const finalTitle = updatedData.title ?? existingEntry.title;
  const finalBody = updatedData.body ?? existingEntry.body;

  let newEmbedding: number[] | null = null;
  if (updatedData.title || updatedData.body) {
    const content = `${finalTitle}\n${finalBody}`
      .trim()
      .slice(0, CONTENT_MAX_LENGTH);
    newEmbedding = await generateEmbedding(content);
  }

  let newImageMetadata: ImageMetadata | null = null;
  let oldImageKey: string | null = null;

  if (updatedData.image && existingEntry.type === ENTRY_TYPE_IMAGE) {
    oldImageKey = getKeyFromUrl(existingEntry.imageContent!.url);

    const metadata = await sharp(updatedData.image).metadata();
    if (!metadata.format || !metadata.width || !metadata.height) {
      throw new ImageMetadataError();
    }
    const extension = metadata.format === 'jpg' ? 'jpeg' : metadata.format;
    const newKey = `${slug}.${extension}`;

    await uploadFile({
      key: newKey,
      body: updatedData.image,
      contentType: `image/${extension}`,
    });

    newImageMetadata = {
      width: metadata.width,
      height: metadata.height,
      key: newKey,
    };
  }

  try {
    const result = await db.$transaction(async tx => {
      await tx.entry.update({
        where: { slug },
        data: {
          title: finalTitle,
          body: finalBody,
          updatedAt: new Date(),
        },
      });

      if (newEmbedding) {
        await tx.$executeRaw`
          UPDATE entries 
          SET embedding = ${JSON.stringify(newEmbedding)}::vector 
          WHERE id = ${existingEntry.id}
        `;
      }

      if (newImageMetadata) {
        await tx.imageContent.update({
          where: { entryId: existingEntry.id },
          data: {
            url: getPublicUrl(newImageMetadata.key),
            width: newImageMetadata.width,
            height: newImageMetadata.height,
          },
        });
      }

      if (updatedData.url && existingEntry.type === ENTRY_TYPE_LINK) {
        await tx.linkContent.update({
          where: { entryId: existingEntry.id },
          data: {
            url: updatedData.url,
          },
        });
      }

      return tx.entry.findUnique({
        where: { id: existingEntry.id },
        include: { imageContent: true, linkContent: true },
      })!;
    });

    if (oldImageKey) {
      try {
        await deleteFile(oldImageKey);
      } catch {
        // Ignore error
      }
    }

    return result!;
  } catch (err) {
    if (newImageMetadata) {
      try {
        await deleteFile(newImageMetadata.key);
      } catch {
        // Ignore error
      }
    }
    throw err;
  }
}
