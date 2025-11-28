import { z } from 'zod';

const ENTRY_TYPES = ['text', 'image', 'link'] as const;
export const entryTypeSchema = z.enum(['text', 'image', 'link']);

export const entrySchema = z.object({
  id: z.number().int().positive(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  title: z.string().min(1),
  slug: z.string().min(1),
  type: entryTypeSchema,
  embedding: z
    .object({ values: z.array(z.number()).length(1536) })
    .optional()
    .nullable(),
});

export const textContentSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  body: z.string().min(1),
  entryId: z.number().int().positive(),
});

export const imageContentSchema = z.object({
  id: z.number().int().positive(),
  url: z.string().url(),
  title: z.string().min(1),
  caption: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  entryId: z.number().int().positive(),
});

export const linkContentSchema = z.object({
  id: z.number().int().positive(),
  url: z.string().url(),
  resolvedTitle: z.string().optional().nullable(),
  resolvedDesc: z.string().optional().nullable(),
  resolvedImage: z.string().url().optional().nullable(),
  subtype: z.string().default(''),
  entryId: z.number().int().positive(),
});

export const roleSchema = z.enum(['admin', 'user']);

export const userSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  role: roleSchema,
  name: z.string().min(1),
  hashedPassword: z.string().min(1),
  createdAt: z.coerce.date(),
});

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerRequestSchema = loginRequestSchema.extend({
  name: z.string().min(1),
});

export const userResponseSchema = userSchema.omit({
  hashedPassword: true,
  createdAt: true,
});

const createBaseEntrySchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

const createImageEntrySchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
});

const createLinkEntrySchema = z.object({
  url: z.string().url(),
  subtype: z.string().optional(),
});

export const createEntrySchema = z.discriminatedUnion('type', [
  createBaseEntrySchema.extend({ type: z.literal(ENTRY_TYPES[0]) }),
  createBaseEntrySchema.extend({
    type: z.literal(ENTRY_TYPES[1]),
    image: createImageEntrySchema,
  }),
  createBaseEntrySchema.extend({
    type: z.literal(ENTRY_TYPES[2]),
    link: createLinkEntrySchema,
  }),
]);

export type Entry = z.infer<typeof entrySchema>;
export type TextContent = z.infer<typeof textContentSchema>;
export type ImageContent = z.infer<typeof imageContentSchema>;
export type LinkContent = z.infer<typeof linkContentSchema>;
export type User = z.infer<typeof userSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type Role = z.infer<typeof roleSchema>;
export type CreateEntryRequest = z.infer<typeof createEntrySchema>;
