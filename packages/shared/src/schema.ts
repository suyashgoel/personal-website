import { z } from 'zod';

// Constants & Enums

export const ENTRY_TYPES = ['image'] as const;
export const entryTypeSchema = z.enum(['image']);
export const roleSchema = z.enum(['admin', 'user']);

// Entry Content Schemas

export const imageContentSchema = z.object({
  id: z.number().int().positive(),
  url: z.string().url(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  entryId: z.number().int().positive(),
});

// Entry Schemas

export const entryResponseSchema = z.object({
  id: z.number().int().positive(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  title: z.string().min(1),
  body: z.string().min(1),
  slug: z.string().min(1),
  type: entryTypeSchema,
  imageContent: imageContentSchema,
});

export const entriesResponseSchema = z.array(entryResponseSchema);

const createBaseEntrySchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export const createEntrySchema = createBaseEntrySchema.extend({
  type: z.literal('image'),
  image: z.union([z.instanceof(Buffer), z.instanceof(File)]),
});

export const updateEntrySchema = z
  .object({
    title: z.string().min(1).optional(),
    body: z.string().min(1).optional(),
  })
  .refine(data => data.title || data.body);

export const entryParamsSchema = z.object({
  slug: z.string(),
});

// Auth & User Schemas

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

// Recommendation Schemas

export const recommendationItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

export const recommendationsParamsSchema = z
  .object({
    query: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    excludeSlugs: z
      .union([z.string().min(1), z.array(z.string().min(1))])
      .optional(),
  })
  .refine(data => Boolean(data.query) !== Boolean(data.slug));

export const recommendationsResponseSchema = z.array(recommendationItemSchema);

export const topMatchParamsSchema = z.object({
  query: z.string().min(1),
});

// Common Schemas

export const nullResponseSchema = z.null();

// About Schemas

export const aboutContentSchema = z.object({
  body: z.string().min(1),
  contact: z.object({
    email: z.string().email(),
    github: z.string().url(),
    linkedin: z.string().url(),
  }),
});

// Type Exports

export type EntryResponse = z.infer<typeof entryResponseSchema>;
export type ImageContent = z.infer<typeof imageContentSchema>;
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
export type AboutContent = z.infer<typeof aboutContentSchema>;
