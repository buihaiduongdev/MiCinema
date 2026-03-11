export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: { field: string; message: string }[];
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
