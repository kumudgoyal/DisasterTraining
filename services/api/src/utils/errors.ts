/** Custom application error with HTTP status code */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(statusCode: number, code: string, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function notFound(message = 'Resource not found'): AppError {
  return new AppError(404, 'NOT_FOUND', message);
}

export function unauthorized(message = 'Unauthorized'): AppError {
  return new AppError(401, 'UNAUTHORIZED', message);
}

export function forbidden(message = 'Forbidden'): AppError {
  return new AppError(403, 'FORBIDDEN', message);
}

export function badRequest(message = 'Bad request'): AppError {
  return new AppError(400, 'BAD_REQUEST', message);
}

export function conflict(message = 'Resource already exists'): AppError {
  return new AppError(409, 'CONFLICT', message);
}

export function unprocessable(message = 'Unprocessable entity'): AppError {
  return new AppError(422, 'UNPROCESSABLE_ENTITY', message);
}

export function internal(message = 'Internal server error'): AppError {
  return new AppError(500, 'INTERNAL_SERVER_ERROR', message, false);
}
