'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.aboutContentSchema =
  exports.nullResponseSchema =
  exports.topMatchParamsSchema =
  exports.recommendationsResponseSchema =
  exports.recommendationsParamsSchema =
  exports.recommendationItemSchema =
  exports.userResponseSchema =
  exports.registerRequestSchema =
  exports.loginRequestSchema =
  exports.entryParamsSchema =
  exports.updateEntrySchema =
  exports.createEntrySchema =
  exports.entriesResponseSchema =
  exports.entryResponseSchema =
  exports.imageContentSchema =
  exports.roleSchema =
  exports.entryTypeSchema =
  exports.ENTRY_TYPES =
    void 0;
const zod_1 = require('zod');
// Constants & Enums
exports.ENTRY_TYPES = ['image'];
exports.entryTypeSchema = zod_1.z.enum(['image']);
exports.roleSchema = zod_1.z.enum(['admin', 'user']);
// Entry Content Schemas
exports.imageContentSchema = zod_1.z.object({
  id: zod_1.z.number().int().positive(),
  url: zod_1.z.string().url(),
  width: zod_1.z.number().int().positive(),
  height: zod_1.z.number().int().positive(),
  entryId: zod_1.z.number().int().positive(),
});
// Entry Schemas
exports.entryResponseSchema = zod_1.z.object({
  id: zod_1.z.number().int().positive(),
  createdAt: zod_1.z.coerce.date(),
  updatedAt: zod_1.z.coerce.date(),
  title: zod_1.z.string().min(1),
  body: zod_1.z.string().min(1),
  slug: zod_1.z.string().min(1),
  type: exports.entryTypeSchema,
  imageContent: exports.imageContentSchema,
});
exports.entriesResponseSchema = zod_1.z.array(exports.entryResponseSchema);
const createBaseEntrySchema = zod_1.z.object({
  title: zod_1.z.string().min(1),
  body: zod_1.z.string().min(1),
});
exports.createEntrySchema = createBaseEntrySchema.extend({
  type: zod_1.z.literal('image'),
  image: zod_1.z.union([zod_1.z.instanceof(Buffer), zod_1.z.instanceof(File)]),
});
exports.updateEntrySchema = zod_1.z
  .object({
    title: zod_1.z.string().min(1).optional(),
    body: zod_1.z.string().min(1).optional(),
  })
  .refine(data => data.title || data.body);
exports.entryParamsSchema = zod_1.z.object({
  slug: zod_1.z.string(),
});
// Auth & User Schemas
exports.loginRequestSchema = zod_1.z.object({
  email: zod_1.z.string().email(),
  password: zod_1.z.string().min(1),
});
exports.registerRequestSchema = exports.loginRequestSchema.extend({
  name: zod_1.z.string().min(1),
});
exports.userResponseSchema = zod_1.z.object({
  id: zod_1.z.number().int().positive(),
  email: zod_1.z.string().email(),
  role: exports.roleSchema,
  name: zod_1.z.string().min(1),
});
// Recommendation Schemas
exports.recommendationItemSchema = zod_1.z.object({
  slug: zod_1.z.string(),
  title: zod_1.z.string(),
});
exports.recommendationsParamsSchema = zod_1.z
  .object({
    query: zod_1.z.string().min(1).optional(),
    slug: zod_1.z.string().min(1).optional(),
    excludeSlugs: zod_1.z
      .union([zod_1.z.string().min(1), zod_1.z.array(zod_1.z.string().min(1))])
      .optional(),
  })
  .refine(data => Boolean(data.query) !== Boolean(data.slug));
exports.recommendationsResponseSchema = zod_1.z.array(
  exports.recommendationItemSchema
);
exports.topMatchParamsSchema = zod_1.z.object({
  query: zod_1.z.string().min(1),
});
// Common Schemas
exports.nullResponseSchema = zod_1.z.null();
// About Schemas
exports.aboutContentSchema = zod_1.z.object({
  body: zod_1.z.string().min(1),
  contact: zod_1.z.object({
    email: zod_1.z.string().email(),
    github: zod_1.z.string().url(),
    linkedin: zod_1.z.string().url(),
  }),
});
