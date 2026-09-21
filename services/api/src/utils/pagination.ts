import { Request } from 'express';

export interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Parse pagination parameters from query string.
 * Defaults: page=1, limit=20, max limit=100
 */
export function parsePagination(query: Request['query']): PaginationResult {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export interface SortResult {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/**
 * Parse sort parameters from query string.
 */
export function parseSort(query: Request['query'], allowedFields: string[], defaultField = 'createdAt'): SortResult {
  const sortBy = allowedFields.includes(query.sortBy as string) ? (query.sortBy as string) : defaultField;
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
  return { sortBy, sortOrder };
}

/**
 * Create a standardized paginated response object.
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Create a standardized success response.
 */
export function createSuccessResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
}
