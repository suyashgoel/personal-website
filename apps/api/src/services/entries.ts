import { CreateEntry, ENTRY_TYPES } from '@personal-website/shared';
import sharp from 'sharp';
import { db } from '../clients/db';
import { logger } from '../clients/logger';
import { EntryAlreadyExistsError } from '../errors';
import { ImageMetadata } from '../types/image';
import { UploadParams } from '../types/upload';
import { generateEmbedding } from '../utils/openai';
import { deleteFile, getPublicUrl, uploadFile } from '../utils/s3';
import { slugify } from '../utils/slug';

const CONTENT_MAX_LENGTH = 10000;

export async function createEntry(entry: CreateEntry) {
  const content = `${entry.title}\n${entry.body}`
    .trim()
    .slice(0, CONTENT_MAX_LENGTH);
  const embedding = await generateEmbedding(content);
  const slug = slugify(entry.title);

  const existingEntry = await db.entry.findUnique({
    where: { slug: slug },
  });
  if (existingEntry) {
    logger.error({ slug: slug }, 'Entry with this slug already exists');
    throw new EntryAlreadyExistsError();
  }

  let imageMetadata: ImageMetadata | null = null;
  if (entry.type === ENTRY_TYPES[1]) {
    const image = entry.image;

    const metadata = await sharp(image).metadata();
    const format = metadata.format;
    const extension = format === 'jpg' ? 'jpeg' : format;

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
      SET embedding = ${`[${embedding.join(',')}]`}::vector 
      WHERE id = ${newEntry.id}
    `;

      if (entry.type === ENTRY_TYPES[1] && imageMetadata) {
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

      if (entry.type === ENTRY_TYPES[2]) {
        // Link entry
        await tx.linkContent.create({
          data: {
            url: entry.link.url,
            subtype: entry.link.subtype,
            entryId: newEntry.id,
          },
        });
      }

      return tx.entry.findUnique({
        where: { id: newEntry.id },
        include: {
          imageContent: true,
          linkContent: true,
        },
      });
    });
    return result;
  } catch (err) {
    if (imageMetadata) {
      try {
        await deleteFile(imageMetadata.key);
        logger.info(
          { key: imageMetadata.key },
          'Cleaned up orphaned S3 file after DB failure'
        );
      } catch (err) {
        logger.error(
          { err: err, key: imageMetadata.key },
          'Failed to cleanup orphaned S3 file'
        );
      }
    }
    throw err;
  }
}
