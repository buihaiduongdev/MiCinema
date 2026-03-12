export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const getPaginationData = (
  totalItems: number,
  page: number,
  limit: number,
): PaginationMeta => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const getSkip = (page: number, limit: number): number =>
  (page - 1) * limit;
