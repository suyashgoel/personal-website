import { z } from 'zod';

export const ENTRY_TYPES = ['text', 'image', 'link'] as const;
export const entryTypeSchema = z.enum(['text', 'image', 'link']);

export const imageContentSchema = z.object({
  id: z.number().int().positive(),
  url: z.string().url(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  entryId: z.number().int().positive(),
});

export const linkContentSchema = z.object({
  id: z.number().int().positive(),
  url: z.string().url(),
  resolvedTitle: z.string().nullable(),
  resolvedDesc: z.string().nullable(),
  resolvedImage: z.string().url().nullable(),
  subtype: z.string().nullable(),
  entryId: z.number().int().positive(),
});

export const entryResponseSchema = z.object({
  id: z.number().int().positive(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  title: z.string().min(1),
  body: z.string().min(1),
  slug: z.string().min(1),
  type: entryTypeSchema,
  imageContent: imageContentSchema.nullable(),
  linkContent: linkContentSchema.nullable(),
});

export const entriesResponseSchema = z.array(entryResponseSchema);

export const roleSchema = z.enum(['admin', 'user']);

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerRequestSchema = loginRequestSchema.extend({
  name: z.string().min(1),
});

export const userResponseSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  role: roleSchema,
  name: z.string().min(1),
});

const createBaseEntrySchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export const createEntrySchema = z.discriminatedUnion('type', [
  createBaseEntrySchema.extend({ type: z.literal('text') }),
  createBaseEntrySchema.extend({
    type: z.literal('image'),
    image: z.instanceof(Buffer),
  }),
  createBaseEntrySchema.extend({
    type: z.literal('link'),
    url: z.string().url(),
  }),
]);

export const updateEntrySchema = z
  .object({
    title: z.string().min(1).optional(),
    body: z.string().min(1).optional(),
    image: z.instanceof(Buffer).optional(),
    url: z.string().url().optional(),
  })
  .refine(data => data.title || data.body || data.image || data.url);

export const entryParamsSchema = z.object({
  slug: z.string(),
});

export const nullResponseSchema = z.null();

export const recommendationItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

export const recommendationsParamsSchema = z
  .object({
    query: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
  })
  .refine(data => Boolean(data.query) !== Boolean(data.slug));

export const recommendationsResponseSchema = z.array(recommendationItemSchema);

export const topMatchParamsSchema = z.object({
  query: z.string().min(1),
});

export type EntryResponse = z.infer<typeof entryResponseSchema>;
export type ImageContent = z.infer<typeof imageContentSchema>;
export type LinkContent = z.infer<typeof linkContentSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type Role = z.infer<typeof roleSchema>;
export type CreateEntry = z.infer<typeof createEntrySchema>;
export type UpdateEntry = z.infer<typeof updateEntrySchema>;
export type EntryParams = z.infer<typeof entryParamsSchema>;
export type NullResponse = z.infer<typeof nullResponseSchema>;
export type RecommendationItem = z.infer<typeof recommendationItemSchema>;
export type RecommendationsParams = z.infer<typeof recommendationsParamsSchema>;
export type RecommendationsResponse = z.infer<
  typeof recommendationsResponseSchema
>;
export type TopMatchParams = z.infer<typeof topMatchParamsSchema>;
