import { z } from "zod";

export const entryTypeSchema = z.enum(["text", "image", "link"]);

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
  subtype: z.string().default(""),
  entryId: z.number().int().positive(),
});

export const userSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  hashedPassword: z.string().min(1),
  createdAt: z.coerce.date(),
});

export type Entry = z.infer<typeof entrySchema>;
export type TextContent = z.infer<typeof textContentSchema>;
export type ImageContent = z.infer<typeof imageContentSchema>;
export type LinkContent = z.infer<typeof linkContentSchema>;
export type User = z.infer<typeof userSchema>;
