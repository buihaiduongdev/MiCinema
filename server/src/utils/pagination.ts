/**
 * Pagination Utility
 *
 * Export:
 * - getPaginationParams(query: { page?, limit? }): { skip: number, limit: number, page: number }
 * - getPaginationMeta(total: number, page: number, limit: number): { page, limit, total, totalPages }
 *
 * Dùng: trong service khi query MongoDB
 * VD: Model.find().skip(skip).limit(limit)
 */
