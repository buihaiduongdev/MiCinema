/**
 * Common/Shared Validation Schemas (Zod)
 *
 * Export:
 * - paginationSchema: z.object({ page: z.number().default(1), limit: z.number().default(10) })
 * - searchParamsSchema: z.object({ search?: z.string(), sortBy?, sortOrder? })
 * - objectIdSchema: z.string().regex(/^[a-f\d]{24}$/i) — validate MongoDB ObjectId
 *
 * Type exports:
 * - PaginationParams, SearchParams
 */
