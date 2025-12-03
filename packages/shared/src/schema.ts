import { z } from 'zod';

// Constants & Enums

export const ENTRY_TYPES = ['text', 'image', 'link'] as const;
export const entryTypeSchema = z.enum(['text', 'image', 'link']);
export const roleSchema = z.enum(['admin', 'user']);

// Entry Content Schemas

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

// Entry Schemas

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
  hero: z.object({
    name: z.string(),
    introduction: z.string(),
  }),
  journey: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      period: z.string(),
      description: z.string(),
      sortOrder: z.number(),
    })
  ),
  identity: z.object({
    statements: z.array(z.string()),
    revelation: z.string(),
  }),
  loves: z.array(z.string()),
  purpose: z.object({
    why: z.string(),
    invitation: z.string(),
  }),
  contact: z.object({
    closing: z.string(),
    email: z.string().email(),
    linkedin: z.string().url(),
    x: z.string().url(),
  }),
});

// Type Exports

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
export type AboutContent = z.infer<typeof aboutContentSchema>;
